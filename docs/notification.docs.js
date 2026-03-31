module.exports = {
  '/notiservice/api/v1/notifications': {
    post: {
      tags: ['Notification'],
      summary: 'Receive notification payload',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['subject', 'recepientEmails', 'content'],
              properties: {
                subject: { type: 'string', example: 'Movie Booking Confirmed' },
                recepientEmails: {
                  type: 'array',
                  items: { type: 'string' },
                  example: ['jai@example.com']
                },
                content: { type: 'string', example: 'Your booking has been confirmed.' }
              }
            }
          }
        }
      },
      responses: {
        200: { description: 'Notification received successfully' }
      }
    }
  }
};