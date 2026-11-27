const recordSchema = { $ref: '#/components/schemas/PatientRecord' };

module.exports = {
  openapi: '3.1.0',
  jsonSchemaDialect: 'https://spec.openapis.org/oas/3.1/dialect/base',
  info: {
    title: 'Patient Records API',
    summary: 'Clinical records of the patients of a hospital network.',
    version: '2.3.0',
    license: { name: 'Apache 2.0', identifier: 'Apache-2.0' },
  },
  servers: [
    { url: 'https://health.example.org/api-patient-records/v2', description: 'Production' },
    { url: 'https://api-health.example.org/api-patient-records/v2', description: 'Prefix in host and path' },
    { url: 'https://health.example.org/api-patient-records', description: 'Without version segment' },
    { url: '/api-patient-records/v2', description: 'Relative URL' },
    {
      url: 'https://{region}.health.example.org/api-patient-records/v2',
      description: 'Templated host',
      variables: { region: { default: 'eu', enum: ['eu', 'us'] } },
    },
    { url: 'http://records-service:8080/api-patient-records/v2', description: 'In-cluster service' },
  ],
  paths: {
    '/status': {
      get: { operationId: 'getStatus', responses: { 200: { description: 'Up' } } },
    },
    '/patients/{patientId}/records': {
      servers: [{ url: 'https://records.example.org/records/v2' }],
      get: {
        operationId: 'listRecords',
        servers: [{ url: 'https://records-read.example.org/read/v2' }],
        parameters: [{ name: 'patientId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: {
            description: 'Records of the patient',
            content: { 'application/json': { schema: { type: 'array', items: recordSchema } } },
          },
        },
      },
    },
    '/patients/{patientId}/allergies': {
      $ref: '#/components/pathItems/Allergies',
    },
  },
  webhooks: {
    recordAmended: {
      servers: [{ url: 'https://hooks.example.org/hooks/v1' }],
      post: {
        requestBody: { content: { 'application/json': { schema: recordSchema } } },
        responses: { 204: { description: 'Acknowledged' } },
      },
    },
  },
  components: {
    pathItems: {
      Allergies: {
        servers: [{ url: 'https://allergies.example.org/allergies/v1' }],
        get: {
          operationId: 'listAllergies',
          parameters: [{ name: 'patientId', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Allergies of the patient' } },
        },
      },
    },
    schemas: {
      PatientRecord: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' },
          dischargedAt: { type: ['string', 'null'], format: 'date-time' },
          attendingPhysician: { type: ['object', 'null'], properties: { name: { type: 'string' } } },
          sourceUrl: { type: ['string', 'null'], format: 'uri', examples: ['https://health.example.org/records/v2'] },
        },
      },
    },
  },
};
