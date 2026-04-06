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
  '/mba/api/v1/payments/razorpay/order': {
    post: {
      tags: ['Payment'],
      summary: 'Create Razorpay order',
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
        201: { description: 'Razorpay order created successfully' },
        400: { description: 'Invalid request' },
        501: { description: 'Gateway not configured' }
      }
    }
  },
  '/mba/api/v1/payments/razorpay/verify': {
    post: {
      tags: ['Payment'],
      summary: 'Verify Razorpay payment',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['bookingId', 'amount', 'razorpayOrderId', 'razorpayPaymentId', 'razorpaySignature'],
              properties: {
                bookingId: { type: 'string', example: '6812ab34cd56ef7890ab5555' },
                amount: { type: 'number', example: 500 },
                razorpayOrderId: { type: 'string', example: 'order_Q1ABCD2345efgh' },
                razorpayPaymentId: { type: 'string', example: 'pay_Q1ABCD2345efgh' },
                razorpaySignature: { type: 'string', example: 'generated_signature' }
              }
            }
          }
        }
      },
      responses: {
        200: { description: 'Payment verified successfully' },
        400: { description: 'Invalid request or signature mismatch' },
        501: { description: 'Gateway not configured' }
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
