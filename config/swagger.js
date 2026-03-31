const swaggerUi = require('swagger-ui-express');

const authDocs = require('../docs/auth.docs');
const userDocs = require('../docs/user.docs');
const movieDocs = require('../docs/movie.docs');
const theatreDocs = require('../docs/theatre.docs');
const showDocs = require('../docs/show.docs');
const bookingDocs = require('../docs/booking.docs');
const paymentDocs = require('../docs/payment.docs');
const notificationDocs = require('../docs/notification.docs');

const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Movie Booking Application API',
    version: '1.0.0',
    description: 'API documentation for Movie Booking Application using Express + Prisma + MongoDB'
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Local server'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
      ErrorResponse: {
        type: 'object',
        properties: {
          err: { type: 'object' },
          data: { type: 'object' },
          message: { type: 'string' },
          success: { type: 'boolean', example: false }
        }
      },
      SuccessResponse: {
        type: 'object',
        properties: {
          err: { type: 'object' },
          data: { type: 'object' },
          message: { type: 'string' },
          success: { type: 'boolean', example: true }
        }
      },
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '6812ab34cd56ef7890ab1234' },
          name: { type: 'string', example: 'jai' },
          email: { type: 'string', example: 'jai@example.com' },
          userRole: { type: 'string', example: 'CUSTOMER' },
          userStatus: { type: 'string', example: 'APPROVED' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      Movie: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '6812ab34cd56ef7890ab1234' },
          name: { type: 'string', example: 'Avengers' },
          description: { type: 'string', example: 'Marvel superhero movie' },
          casts: {
            type: 'array',
            items: { type: 'string' },
            example: ['Robert Downey Jr', 'Chris Evans']
          },
          trailerUrl: { type: 'string', example: 'https://youtube.com/watch?v=abc123' },
          language: { type: 'string', example: 'English' },
          releaseDate: { type: 'string', format: 'date-time', example: '2026-01-01T00:00:00.000Z' },
          director: { type: 'string', example: 'Russo Brothers' },
          releaseStatus: { type: 'string', example: 'UPCOMING' },
          poster: { type: 'string', example: 'https://image-url.com/poster.jpg' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      Theatre: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '6812ab34cd56ef7890ab1234' },
          name: { type: 'string', example: 'PVR Cinemas' },
          description: { type: 'string', example: 'Big theatre' },
          city: { type: 'string', example: 'DELHI' },
          pincode: { type: 'integer', example: 110001 },
          address: { type: 'string', example: 'Connaught Place' },
          movieIds: {
            type: 'array',
            items: { type: 'string' },
            example: ['6812ab34cd56ef7890ab9999']
          },
          ownerId: { type: 'string', example: '6812ab34cd56ef7890ab7777' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      Show: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '6812ab34cd56ef7890ab1234' },
          theatreId: { type: 'string', example: '6812ab34cd56ef7890ab2222' },
          movieId: { type: 'string', example: '6812ab34cd56ef7890ab3333' },
          timing: { type: 'string', format: 'date-time', example: '2026-04-05T18:30:00.000Z' },
          noOfSeats: { type: 'integer', example: 120 },
          seatConfiguration: { type: 'string', nullable: true },
          price: { type: 'number', example: 250 },
          format: { type: 'string', example: '2D' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      Booking: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '6812ab34cd56ef7890ab1234' },
          theatreId: { type: 'string' },
          movieId: { type: 'string' },
          userId: { type: 'string' },
          timing: { type: 'string', format: 'date-time', example: '2026-04-05T18:30:00.000Z' },
          noOfSeats: { type: 'integer', example: 2 },
          totalCost: { type: 'number', example: 500 },
          status: { type: 'string', example: 'PROCESSING' },
          seat: { type: 'string', nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      Payment: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '6812ab34cd56ef7890ab1234' },
          bookingId: { type: 'string', example: '6812ab34cd56ef7890ab5555' },
          amount: { type: 'number', example: 500 },
          status: { type: 'string', example: 'SUCCESS' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      }
    }
  },
  paths: {
    ...authDocs,
    ...userDocs,
    ...movieDocs,
    ...theatreDocs,
    ...showDocs,
    ...bookingDocs,
    ...paymentDocs,
    ...notificationDocs
  }
};

const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};

module.exports = setupSwagger;