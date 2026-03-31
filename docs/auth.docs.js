module.exports = {
  '/mba/api/v1/auth/signup': {
    post: {
      tags: ['Auth'],
      summary: 'Register a new user',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['name', 'email', 'password'],
              properties: {
                name: { type: 'string', example: 'jai' },
                email: { type: 'string', example: 'jai@example.com' },
                password: { type: 'string', example: '123456' },
                userRole: { type: 'string', example: 'CUSTOMER' }
              }
            }
          }
        }
      },
      responses: {
        201: { description: 'User registered successfully' },
        400: { description: 'Bad request' },
        500: { description: 'Internal server error' }
      }
    }
  },
  '/mba/api/v1/auth/signin': {
    post: {
      tags: ['Auth'],
      summary: 'Login user',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['email', 'password'],
              properties: {
                email: { type: 'string', example: 'jai@example.com' },
                password: { type: 'string', example: '123456' }
              }
            }
          }
        }
      },
      responses: {
        200: { description: 'Login successful' },
        401: { description: 'Unauthorized' },
        500: { description: 'Internal server error' }
      }
    }
  },
  '/mba/api/v1/auth/reset': {
    patch: {
      tags: ['Auth'],
      summary: 'Reset password',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['oldPassword', 'newPassword'],
              properties: {
                oldPassword: { type: 'string', example: '123456' },
                newPassword: { type: 'string', example: 'abcdef' }
              }
            }
          }
        }
      },
      responses: {
        200: { description: 'Password updated successfully' },
        401: { description: 'Unauthorized' },
        403: { description: 'Forbidden' },
        500: { description: 'Internal server error' }
      }
    }
  }
};