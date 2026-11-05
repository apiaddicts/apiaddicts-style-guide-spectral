const { linterForRule } = require('../../helpers/utils');

let linter;

const oar077fail = require('./OAR077/fail-snake-param');
const oar077ok = require('./OAR077/ok-snake-param');
const oar077failSharedPathItem = require('./OAR077/fail-shared-path-item-query-param');
const oar077okSharedPathItem = require('./OAR077/ok-shared-path-item-query-param');
const oar077okDigitInName = require('./OAR077/ok-digit-in-name');
const oar077failDigitPlacement = require('./OAR077/fail-digit-placement');
const oar077okReportedCase = require('./OAR077/ok-reported-case');
const oar077failLargeMultiPath = require('./OAR077/fail-large-multi-path');
const oar077failRefQueryParam = require('./OAR077/fail-ref-query-param');
const oar077failRefs = require('./OAR077/fail-refs');
const oar077failExample31 = require('./OAR077/fail-example-31');
const oar077okExample31 = require('./OAR077/ok-example-31');
const oar077failExample320 = require('./OAR077/fail-example-320');
const oar077okExample320 = require('./OAR077/ok-example-320');

const paths = (results) => results.map((r) => r.path.join('.')).sort();

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR077');
  return linter;
});

test('apiq:OAR077 should find errors', () => {
  return linter.run(oar077fail).then((results) => {
    expect(results.length).toBe(3);
    expect(results[0].path.join('.')).toBe('paths./pets.get.parameters.0.name');
    expect(results[1].path.join('.')).toBe('paths./pets.get.parameters.1.name');
    expect(results[2].path.join('.')).toBe('paths./pets.get.parameters.2.name');
  });
});

test('apiq:OAR077 should find no errors', () => {
  return linter.run(oar077ok).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('apiq:OAR077 flags a bad name on a shared path-item-level query parameter', () => {
  return linter.run(oar077failSharedPathItem).then((results) => {
    expect(results.length).toBe(1);
    expect(results[0].path.join('.')).toBe('paths./pets.parameters.0.name');
  });
});

test('apiq:OAR077 accepts a snake_case shared path-item-level query parameter', () => {
  return linter.run(oar077okSharedPathItem).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('apiq:OAR077 accepts digits in any word after the first letter', () => {
  return linter.run(oar077okDigitInName).then((results) => {
    expect(results).toEqual([]);
  });
});

test('apiq:OAR077 flags names with digits that are not snake_case', () => {
  return linter.run(oar077failDigitPlacement).then((results) => {
    expect(paths(results)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => `paths./customers.get.parameters.${i}.name`).sort());
    expect(results[0].message).toBe('OAR077: All parameters in query must be snake_case.');
  });
});

test('apiq:OAR077 accepts the reported onboarding_status1 parameter reached through $ref', () => {
  return linter.run(oar077okReportedCase).then((results) => {
    expect(results).toEqual([]);
  });
});

test('apiq:OAR077 flags bad names across shared and operation-level query parameters on several paths/verbs', () => {
  return linter.run(oar077failLargeMultiPath).then((results) => {
    expect(results.length).toBe(3);
  });
});

test('apiq:OAR077 flags a bad name reached only through a $ref query parameter', () => {
  return linter.run(oar077failRefQueryParam).then((results) => {
    expect(results.length).toBe(1);
  });
});

test('apiq:OAR077 follows chained and callback $refs, ignoring path parameters and unused definitions', () => {
  return linter.run(oar077failRefs).then((results) => {
    expect(paths(results)).toEqual([
      'paths./customers.get.parameters.1.name',
      'paths./customers.parameters.0.name',
      'paths./customers.post.callbacks.onboardingCompleted.{$request.body#/callbackUrl}.post.parameters.0.name',
    ]);
  });
});

test('apiq:OAR077 checks OpenAPI 3.1 path items, path item refs, callbacks and webhooks', () => {
  return linter.run(oar077failExample31).then((results) => {
    expect(paths(results)).toEqual([
      'paths./customers.get.parameters.1.name',
      'paths./customers/{customerId}.parameters.1.name',
      'paths./customers/{customerId}.patch.callbacks.kycReviewed.{$request.body#/callbackUrl}.parameters.0.name',
      'paths./customers/{customerId}.patch.callbacks.kycReviewed.{$request.body#/callbackUrl}.post.parameters.1.name',
      'paths./customers/{customerId}.patch.parameters.0.name',
      'webhooks.customerArchived.post.parameters.0.name',
      'webhooks.customerCreated.parameters.0.name',
      'webhooks.customerCreated.post.parameters.1.name',
    ]);
  });
});

test('apiq:OAR077 accepts snake_case names with digits and nullable types in OpenAPI 3.1', () => {
  return linter.run(oar077okExample31).then((results) => {
    expect(results).toEqual([]);
  });
});

test('apiq:OAR077 checks the OpenAPI 3.2 query method and additionalOperations, but not querystring parameters', () => {
  return linter.run(oar077failExample320).then((results) => {
    expect(paths(results)).toEqual([
      'paths./customers/search.additionalOperations.LINK.callbacks.linkConfirmed.{$request.query.callback_url}.parameters.0.name',
      'paths./customers/search.additionalOperations.LINK.callbacks.linkConfirmed.{$request.query.callback_url}.post.parameters.0.name',
      'paths./customers/search.additionalOperations.LINK.parameters.0.name',
      'paths./customers/search.query.parameters.0.name',
      'paths./customers/{customerId}.get.callbacks.statusChanged.{$request.query.callback_url}.additionalOperations.NOTIFY.parameters.0.name',
      'webhooks.customerPurged.additionalOperations.PURGE.parameters.0.name',
    ]);
  });
});

test('apiq:OAR077 accepts snake_case names in every OpenAPI 3.2 operation', () => {
  return linter.run(oar077okExample320).then((results) => {
    expect(results).toEqual([]);
  });
});
