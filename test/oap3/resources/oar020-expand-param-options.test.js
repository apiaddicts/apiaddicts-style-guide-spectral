const { linterForRule } = require('../../helpers/utils');

const doc = {
  openapi: '3.0.0',
  info: { version: '1.0.0', title: 'Swagger Petstore' },
  paths: {
    '/pets': {
      get: {
        responses: { 200: { description: 'OK' } }
      }
    },
    '/orders': {
      get: {
        responses: { 200: { description: 'OK' } }
      }
    }
  }
};

test('apiq:OAR020 custom paths + Exclude only excludes the configured path', async () => {
  const linter = await linterForRule('apiq:OAR020', {
    functionOptions: { paths: '/pets', pathValidationStrategy: 'Exclude' }
  });
  const results = await linter.run(doc);
  expect(results.map((r) => r.path.join('/'))).toEqual(
    expect.arrayContaining([expect.stringContaining('orders')])
  );
  expect(results.some((r) => r.path.join('/').includes('pets'))).toBe(false);
});

test('apiq:OAR020 custom paths + Include only processes the configured path', async () => {
  const linter = await linterForRule('apiq:OAR020', {
    functionOptions: { paths: '/orders', pathValidationStrategy: 'Include' }
  });
  const results = await linter.run(doc);
  expect(results.some((r) => r.path.join('/').includes('orders'))).toBe(true);
  expect(results.some((r) => r.path.join('/').includes('pets'))).toBe(false);
});

test('apiq:OAR020 empty paths + Exclude processes everything', async () => {
  const linter = await linterForRule('apiq:OAR020', {
    functionOptions: { paths: '', pathValidationStrategy: 'Exclude' }
  });
  const results = await linter.run(doc);
  expect(results.length).toBe(2);
});

test('apiq:OAR020 empty paths + Include processes nothing', async () => {
  const linter = await linterForRule('apiq:OAR020', {
    functionOptions: { paths: '', pathValidationStrategy: 'Include' }
  });
  const results = await linter.run(doc);
  expect(results.length).toBe(0);
});

test('apiq:OAR020 custom parameterName changes which parameter is required', async () => {
  const linter = await linterForRule('apiq:OAR020', {
    functionOptions: { parameterName: '$custom' }
  });
  const results = await linter.run({
    ...doc,
    paths: {
      '/pets': {
        get: {
          parameters: [{ name: '$expand', in: 'query', schema: { type: 'string' } }],
          responses: { 200: { description: 'OK' } }
        }
      }
    }
  });
  // "$expand" no longer satisfies the check once "parameter-name" is "$custom"
  expect(results.some((r) => r.path.join('/').includes('pets'))).toBe(true);
});

test('apiq:OAR020 missing parameterName reports a configuration error', async () => {
  const linter = await linterForRule('apiq:OAR020', {
    functionOptions: { parameterName: '' }
  });
  const results = await linter.run(doc);
  expect(results.length).toBeGreaterThanOrEqual(1);
  expect(results[0].message).toMatch(/parameterName/);
});
