const query = (name) => ({
  in: 'query',
  name,
  schema: {
    type: 'string',
  },
});

module.exports = {
  openapi: '3.0.3',
  info: {
    version: '1.0.0',
    title: 'Customer Onboarding API',
  },
  paths: {
    '/customers': {
      get: {
        parameters: [
          query('2fa_code'),
          query('_2fa'),
          query('$2fa'),
          query('status1_'),
          query('line__2'),
          query('Status1'),
          query('statusV2'),
          query('status-1'),
          query('status.1'),
          query('42'),
          query('status_1'),
        ],
        responses: {
          200: {
            description: 'Ok',
          },
        },
      },
    },
  },
};
