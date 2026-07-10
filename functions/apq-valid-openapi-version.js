const DEFAULT_VALID_VERSIONS = '2.0,3.0.0,3.0.1,3.0.2,3.0.3,3.1.0';

/**
 * @param {string} targetVal
 * @param {object} options
 * @param {import('@stoplight/spectral-core').RulesetFunctionContext} context
 */
module.exports = (targetVal, options, context) => {
  const raw = (options && options['valid-versions']) || DEFAULT_VALID_VERSIONS;
  const validVersions = (Array.isArray(raw) ? raw : String(raw).split(','))
    .map(version => String(version).trim())
    .filter(Boolean);

  if (!validVersions.includes(String(targetVal))) {
    return [
      {
        message: context.rule.message
          .replace('{{value}}', String(targetVal))
          .replace('{{allowed}}', validVersions.join(', '))
      }
    ];
  }
};
