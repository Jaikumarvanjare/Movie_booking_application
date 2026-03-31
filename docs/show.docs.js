module.exports = {
  '/mba/api/v1/shows': {
    post: {
      tags: ['Show'],
      summary: 'Create show',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['theatreId', 'movieId', 'timing', 'noOfSeats', 'price'],
              properties: {
                theatreId: { type: 'string', example: '6812ab34cd56ef7890ab2222' },
                movieId: { type: 'string', example: '6812ab34cd56ef7890ab3333' },
                timing: { type: 'string', format: 'date-time', example: '2026-04-05T18:30:00.000Z' },
                noOfSeats: { type: 'integer', example: 120 },
                seatConfiguration: { type: 'string', example: "{'rows':[{'number':1,'seats':[{'number':1,'status':1}]}]}" },
                price: { type: 'number', example: 250 },
                format: { type: 'string', example: '2D' }
              }
            }
          }
        }
      },
      responses: {
        200: { description: 'Show created successfully' },
        500: { description: 'Internal server error' }
      }
    },
    get: {
      tags: ['Show'],
      summary: 'Get shows',
      parameters: [
        { name: 'theatreId', in: 'query', schema: { type: 'string' } },
        { name: 'movieId', in: 'query', schema: { type: 'string' } }
      ],
      responses: {
        200: { description: 'Shows fetched successfully' },
        404: { description: 'No shows found' },
        500: { description: 'Internal server error' }
      }
    }
  },
  '/mba/api/v1/shows/{id}': {
    patch: {
      tags: ['Show'],
      summary: 'Update show',
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
                seatConfiguration: { type: 'string' },
                price: { type: 'number' },
                format: { type: 'string' }
              }
            }
          }
        }
      },
      responses: {
        200: { description: 'Show updated successfully' },
        404: { description: 'Show not found' },
        500: { description: 'Internal server error' }
      }
    },
    delete: {
      tags: ['Show'],
      summary: 'Delete show',
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
        200: { description: 'Show deleted successfully' },
        404: { description: 'Show not found' },
        500: { description: 'Internal server error' }
      }
    }
  }
};