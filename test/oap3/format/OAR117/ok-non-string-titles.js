module.exports = {
  numeric: {
    openapi: '3.0.3',
    info: { version: '1.0.0', title: 12345 },
    paths: {}
  },
  boolean: {
    openapi: '3.0.3',
    info: { version: '1.0.0', title: true },
    paths: {}
  },
  nullTitle: {
    openapi: '3.1.0',
    info: { version: '1.0.0', title: null },
    paths: {}
  },
  list: {
    openapi: '3.1.0',
    info: { version: '1.0.0', title: ['Test', 'Payments API'] },
    paths: {}
  },
  map: {
    openapi: '3.2.0',
    info: { version: '1.0.0', title: { value: 'Test Payments API' } },
    paths: {}
  }
};
