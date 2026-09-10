const DEFAULT_VALID_VERSIONS = '2.0,3.0.0,3.0.1,3.0.2,3.0.3,3.0.4,3.1.0,3.1.1,3.1.2,3.2.0';

/**
 * @param {string} targetVal
 * @param {object} options
 */
module.exports = (targetVal, options) => {
  const raw = (options && options['valid-versions']) || DEFAULT_VALID_VERSIONS;
  const validVersions = (Array.isArray(raw) ? raw : String(raw).split(','))
    .map(version => String(version).trim())
    .filter(Boolean);

  if (!validVersions.includes(String(targetVal))) {
    return [
      {
        message: `OAR085: The OpenAPI version '${targetVal}' is not allowed. Allowed versions: ${validVersions.join(', ')}.`
      }
    ];
  }
};
