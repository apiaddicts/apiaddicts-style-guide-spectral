const responses = { 200: { description: 'Ok' } };

module.exports = {
  openapi: '3.1.0',
  info: { title: 'Clinical Records API', version: '3.1.0', summary: 'Patient records and lab results' },
  jsonSchemaDialect: 'https://spec.openapis.org/oas/3.1/dialect/base',
  servers: [
    { url: 'https://records.health.example.com/api-records/v3' },
    { url: 'http://records-service.health.svc.cluster.local:8080/api-records/v3', description: 'In-cluster upstream' },
  ],
  paths: {
    '/patients': {
      get: {
        operationId: 'listPatients',
        servers: [{ url: 'https://{site}.health.example.com/api-records/v3', variables: { site: { default: 'madrid', enum: ['madrid', 'lima'] } } }],
        responses,
      },
    },
    '/patients/{patientId}/records': { $ref: '#/components/pathItems/PatientRecords' },
    '/lab-results': {
      query: { operationId: 'notAnOperationIn31', servers: [{ url: '/query-is-only-an-operation-in-3-2' }], responses },
      get: { operationId: 'listLabResults', responses },
    },
  },
  webhooks: {
    labResultReady: {
      servers: [{ url: '/webhooks' }],
      post: { operationId: 'labResultReady', servers: [{ url: '/webhooks/labs' }], responses },
    },
  },
  components: {
    pathItems: {
      PatientRecords: {
        servers: [{ url: 'https://archive.health.example.com/api-records/v3' }],
        get: { operationId: 'listPatientRecords', responses },
      },
      Unused: { servers: [{ url: '/unused' }], get: { operationId: 'unusedOperation', responses } },
    },
    schemas: {
      LabResult: {
        type: 'object',
        properties: {
          value: { type: ['number', 'null'] },
          unit: { type: ['string', 'null'] },
        },
      },
    },
  },
};
