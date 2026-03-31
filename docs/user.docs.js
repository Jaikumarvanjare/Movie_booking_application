module.exports = {
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