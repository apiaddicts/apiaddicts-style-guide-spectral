module.exports = {
  swagger: '2.0',
  info: { version: '1.0.0', title: 'AllOf Composed API' },
  paths: {
    '/gizmos': {
      post: {
        responses: {
          201: {
            description: 'Created',
            schema: {
              allOf: [
                {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'object',
                      properties: { id: { type: 'string' } },
                    },
                  },
                },
              ],
            },
          },
        },
      },
    },
  },
};
