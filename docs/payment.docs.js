module.exports = {
  '/mba/api/v1/payments': {
    post: {
      tags: ['Payment'],
      summary: 'Create payment',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['bookingId', 'amount'],
              properties: {
                bookingId: { type: 'string', example: '6812ab34cd56ef7890ab5555' },
                amount: { type: 'number', example: 500 }
              }
            }
          }
        }
      },
      responses: {
        200: { description: 'Payment processed successfully' },
        402: { description: 'Payment required / failed' },
        410: { description: 'Booking expired' },
        500: { description: 'Internal server error' }
      }
    },
    get: {
      tags: ['Payment'],
      summary: 'Get payments for logged-in user',
      security: [{ bearerAuth: [] }],
      responses: {
        200: { description: 'Payments fetched successfully' },
        500: { description: 'Internal server error' }
      }
    }
  },
  '/mba/api/v1/payments/{id}': {
    get: {
      tags: ['Payment'],
      summary: 'Get payment details by id',
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
        200: { description: 'Payment fetched successfully' },
        404: { description: 'Payment not found' },
        500: { description: 'Internal server error' }
      }
    }
  }
};