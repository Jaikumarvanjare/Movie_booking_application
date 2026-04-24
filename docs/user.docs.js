module.exports = {
  '/mba/api/v1/users/me': {
    get: {
      tags: ['User'],
      summary: 'Fetch the authenticated user profile',
      security: [{ bearerAuth: [] }],
      responses: {
        200: { description: 'Profile fetched successfully' },
        401: { description: 'Unauthorized' },
        403: { description: 'Forbidden' },
        500: { description: 'Internal server error' }
      }
    },
    patch: {
      tags: ['User'],
      summary: 'Update the authenticated user profile',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['name'],
              properties: {
                name: { type: 'string', example: 'John Doe' }
              }
            }
          }
        }
      },
      responses: {
        200: { description: 'Profile updated successfully' },
        400: { description: 'Bad request' },
        401: { description: 'Unauthorized' },
        403: { description: 'Forbidden' },
        500: { description: 'Internal server error' }
      }
    }
  },
  '/mba/api/v1/user/{id}': {
    patch: {
      tags: ['User'],
      summary: 'Update user role or status',
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
              properties: {
                userRole: { type: 'string', example: 'ADMIN' },
                userStatus: { type: 'string', example: 'APPROVED' }
              }
            }
          }
        }
      },
      responses: {
        200: { description: 'User updated successfully' },
        401: { description: 'Unauthorized' },
        500: { description: 'Internal server error' }
      }
    }
  }
};