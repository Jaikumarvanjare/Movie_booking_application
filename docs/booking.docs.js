module.exports = {
  '/mba/api/v1/bookings': {
    post: {
      tags: ['Booking'],
      summary: 'Create booking',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['theatreId', 'movieId', 'timing', 'noOfSeats'],
              properties: {
                theatreId: { type: 'string', example: '6812ab34cd56ef7890ab2222' },
                movieId: { type: 'string', example: '6812ab34cd56ef7890ab3333' },
                timing: { type: 'string', format: 'date-time', example: '2026-04-05T18:30:00.000Z' },
                noOfSeats: { type: 'integer', example: 2 },
                seat: {
                  type: 'string',
                  example: "[{'rowNumber':1,'seatNumber':2},{'rowNumber':1,'seatNumber':3}]"
                }
              }
            }
          }
        }
      },
      responses: {
        201: { description: 'Booking created successfully' },
        404: { description: 'Show not found' },
        500: { description: 'Internal server error' }
      }
    },
    get: {
      tags: ['Booking'],
      summary: 'Get logged-in user bookings',
      security: [{ bearerAuth: [] }],
      responses: {
        200: { description: 'Bookings fetched successfully' },
        500: { description: 'Internal server error' }
      }
    }
  },
  '/mba/api/v1/bookings/all': {
    get: {
      tags: ['Booking'],
      summary: 'Get all bookings',
      security: [{ bearerAuth: [] }],
      responses: {
        200: { description: 'All bookings fetched successfully' },
        500: { description: 'Internal server error' }
      }
    }
  },
  '/mba/api/v1/bookings/{id}': {
    get: {
      tags: ['Booking'],
      summary: 'Get booking by id',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' }
        }
      ],
      responses: {
        200: { description: 'Booking fetched successfully' },
        404: { description: 'Booking not found' },
        500: { description: 'Internal server error' }
      }
    },
    patch: {
      tags: ['Booking'],
      summary: 'Update booking',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' }
        }
      ],
      requestBody: {
        required: false,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                timing: { type: 'string', format: 'date-time' },
                noOfSeats: { type: 'integer' },
                totalCost: { type: 'number' },
                status: { type: 'string', example: 'CANCELLED' },
                seat: { type: 'string' }
              }
            }
          }
        }
      },
      responses: {
        200: { description: 'Booking updated successfully' },
        404: { description: 'Booking not found' },
        500: { description: 'Internal server error' }
      }
    }
  }
};