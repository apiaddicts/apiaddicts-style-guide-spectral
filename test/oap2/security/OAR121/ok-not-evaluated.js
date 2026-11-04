module.exports = {
  swagger: '2.0',
  info: { title: 'Pet Clinic API', version: '1.17.0' },
  host: 'api.petclinic.example.com',
  security: [{ NoType: [] }, { NumericType: [] }, { BlankType: [] }, { NotAnObject: [] }],
  paths: {
    '/owners': { get: { operationId: 'listOwners', responses: { 200: { description: 'Owners' } } } },
  },
  securityDefinitions: {
    NoType: { in: 'header', name: 'X-Key' },
    NumericType: { type: 3 },
    BlankType: { type: '' },
    NotAnObject: 'basic',
  },
};
