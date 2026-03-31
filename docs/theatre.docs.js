module.exports = {
  '/mba/api/v1/theatres': {
    post: {
      tags: ['Theatre'],
      summary: 'Create theatre',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['name', 'pincode', 'city', 'address'],
              properties: {
                name: { type: 'string', example: 'PVR Cinemas' },
                description: { type: 'string', example: 'Big theatre' },
                city: { type: 'string', example: 'DELHI' },
                pincode: { type: 'integer', example: 110001 },
                address: { type: 'string', example: 'Connaught Place' }
              }
            }
          }
        }
      },
      responses: {
        201: { description: 'Theatre created successfully' },
        401: { description: 'Unauthorized' },
        500: { description: 'Internal server error' }
      }
    },
    get: {
      tags: ['Theatre'],
      summary: 'Get all theatres',
      parameters: [
        { name: 'city', in: 'query', schema: { type: 'string' } },
        { name: 'pincode', in: 'query', schema: { type: 'integer' } },
        { name: 'name', in: 'query', schema: { type: 'string' } },
        { name: 'movieId', in: 'query', schema: { type: 'string' } },
        { name: 'limit', in: 'query', schema: { type: 'integer' } },
        { name: 'skip', in: 'query', schema: { type: 'integer' } }
      ],
      responses: {
        200: { description: 'Theatres fetched successfully' },
        500: { description: 'Internal server error' }
      }
    }
  },
  '/mba/api/v1/theatres/{id}': {
    get: {
      tags: ['Theatre'],
      summary: 'Get theatre by id',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' }
        }
      ],
      responses: {
        200: { description: 'Theatre fetched successfully' },
        404: { description: 'Theatre not found' },
        500: { description: 'Internal server error' }
      }
    },
    patch: {
      tags: ['Theatre'],
      summary: 'Update theatre',
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
                city: { type: 'string' },
                pincode: { type: 'integer' },
                address: { type: 'string' }
              }
            }
          }
        }
      },
      responses: {
        200: { description: 'Theatre updated successfully' },
        404: { description: 'Theatre not found' },
        500: { description: 'Internal server error' }
      }
    },
    put: {
      tags: ['Theatre'],
      summary: 'Update theatre',
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
                city: { type: 'string' },
                pincode: { type: 'integer' },
                address: { type: 'string' }
              }
            }
          }
        }
      },
      responses: {
        200: { description: 'Theatre updated successfully' },
        404: { description: 'Theatre not found' },
        500: { description: 'Internal server error' }
      }
    },
    delete: {
      tags: ['Theatre'],
      summary: 'Delete theatre',
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
        200: { description: 'Theatre deleted successfully' },
        404: { description: 'Theatre not found' },
        500: { description: 'Internal server error' }
      }
    }
  },
  '/mba/api/v1/theatres/{id}/movies': {
    patch: {
      tags: ['Theatre'],
      summary: 'Add or remove movies in a theatre',
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
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['movieIds', 'insert'],
              properties: {
                movieIds: {
                  type: 'array',
                  items: { type: 'string' },
                  example: ['6812ab34cd56ef7890ab9999']
                },
                insert: { type: 'boolean', example: true }
              }
            }
          }
        }
      },
      responses: {
        200: { description: 'Movies updated successfully' },
        500: { description: 'Internal server error' }
      }
    },
    get: {
      tags: ['Theatre'],
      summary: 'Get movies running in a theatre',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' }
        }
      ],
      responses: {
        200: { description: 'Movies fetched successfully' },
        404: { description: 'Theatre not found' },
        500: { description: 'Internal server error' }
      }
    }
  },
  '/mba/api/v1/theatres/{theatreId}/movies/{movieId}': {
    get: {
      tags: ['Theatre'],
      summary: 'Check whether a movie is present in a theatre',
      parameters: [
        {
          name: 'theatreId',
          in: 'path',
          required: true,
          schema: { type: 'string' }
        },
        {
          name: 'movieId',
          in: 'path',
          required: true,
          schema: { type: 'string' }
        }
      ],
      responses: {
        200: { description: 'Check successful' },
        404: { description: 'Theatre not found' },
        500: { description: 'Internal server error' }
      }
    }
  }
};