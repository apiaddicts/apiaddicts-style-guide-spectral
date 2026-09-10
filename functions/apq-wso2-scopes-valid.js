/**
 * @param {*} targetVal the `x-wso2-scopes` container node value
 * @param {object} _options unused
 * @param {import('@stoplight/spectral-core').RulesetFunctionContext} context
 */
const DEFINITION_WRONG = "OAR002: WSO2 scopes definition is wrong";
const REQUIRED_PROP = "OAR002: WSO2 scope '{0}' is required";
const REQUIRED_PROPERTIES = ['name', 'key', 'roles'];

const requiredMessage = (prop) => REQUIRED_PROP.replace('{0}', prop);

// A scope property counts as "required but missing" when it is absent, null, a
// blank string, or an empty collection ([] / {}) — mirrors Sonar's OAR002 check.
const isEmptyValue = (value) =>
  value === null
  || (typeof value === 'string' && value.trim() === '')
  || (Array.isArray(value) && value.length === 0)
  || (typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 0);

module.exports = (targetVal, _options, context) => {
  const errors = [];
  const basePath = context.path || [];

  if (targetVal === null || typeof targetVal !== 'object') {
    errors.push({ message: DEFINITION_WRONG, path: basePath });
    return errors;
  }

  const entries = Array.isArray(targetVal)
    ? targetVal.map((scope, index) => [index, scope])
    : Object.keys(targetVal).map((key) => [key, targetVal[key]]);

  if (entries.length === 0) {
    errors.push({ message: DEFINITION_WRONG, path: basePath });
    return errors;
  }

  entries.forEach(([key, scope]) => {
    const scopePath = [...basePath, key];

    if (scope === null || typeof scope !== 'object' || Array.isArray(scope)) {
      REQUIRED_PROPERTIES.forEach((prop) => {
        errors.push({ message: requiredMessage(prop), path: scopePath });
      });
      return;
    }

    REQUIRED_PROPERTIES.forEach((prop) => {
      if (!Object.prototype.hasOwnProperty.call(scope, prop)) {
        errors.push({ message: requiredMessage(prop), path: scopePath });
      } else if (isEmptyValue(scope[prop])) {
        errors.push({ message: requiredMessage(prop), path: [...scopePath, prop] });
      }
    });
  });

  return errors;
};
