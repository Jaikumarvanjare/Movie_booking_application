module.exports = {
  '/mba/api/v1/movies': {
    post: {
      tags: ['Movie'],
      summary: 'Create movie',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: [
                'name',
                'description',
                'casts',
                'trailerUrl',
                'language',
                'releaseDate',
                'director',
                'poster'
              ],
              properties: {
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
                poster: { type: 'string', example: 'https://image-url.com/poster.jpg' }
              }
            }
          }
        }
      },
      responses: {
        201: { description: 'Movie created successfully' },
        401: { description: 'Unauthorized' },
        500: { description: 'Internal server error' }
      }
    },
    get: {
      tags: ['Movie'],
      summary: 'Get all movies',
      parameters: [
        {
          name: 'name',
          in: 'query',
          schema: { type: 'string' }
        }
      ],
      responses: {
        200: { description: 'Movies fetched successfully' },
        404
  : { description: 'No movies found' },
        500: { description: 'Internal server error' }
      }
    }
  },
  '/mba/api/v1/movies/{id}': {
    get: {
      tags: ['Movie'],
      summary: 'Get movie by id',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' }
        }
      ],
      responses: {
        200: { description: 'Movie fetched successfully' },
        404: { description: 'Movie not found' },
        500: { description: 'Internal server error' }
      }
    },
    patch: {
      tags: ['Movie'],
      summary: 'Update movie',
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
                name: { type: 'string' },
                description: { type: 'string' },
                casts: {
                  type: 'array',
                  items: { type: 'string' }
                },
                trailerUrl: { type: 'string' },
                language: { type: 'string' },
                releaseDate: { type: 'string', format: 'date-time' },
                director: { type: 'string' },
                releaseStatus: { type: 'string' },
                poster: { type: 'string' }
              }
            }
          }
        }
      },
      responses: {
        200: { description: 'Movie updated successfully' },
        404: { description: 'Movie not found' },
        500: { description: 'Internal server error' }
      }
    },
    put: {
      tags: ['Movie'],
      summary: 'Update movie',
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
                name: { type: 'string' },
                description: { type: 'string' },
                casts: {
                  type: 'array',
                  items: { type: 'string' }
                },
                trailerUrl: { type: 'string' },
                language: { type: 'string' },
                releaseDate: { type: 'string', format: 'date-time' },
                director: { type: 'string' },
                releaseStatus: { type: 'string' },
                poster: { type: 'string' }
              }
            }
          }
        }
      },
      responses: {
        200: { description: 'Movie updated successfully' },
        404: { description: 'Movie not found' },
        500: { description: 'Internal server error' }
      }
    },
    delete: {
      tags: ['Movie'],
      summary: 'Delete movie',
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
        200: { description: 'Movie deleted successfully' },
        404: { description: 'Movie not found' },
        500: { description: 'Internal server error' }
      }
    }
  }
};      