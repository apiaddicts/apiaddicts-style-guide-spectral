/**
 * @param {object} targetVal
 * @param {object} options
 * @param {import('@stoplight/spectral-core').RulesetFunctionContext} context
 */
module.exports = (targetVal, options, context) => {
  const errors = [];
  const dataProperty = (options && options['data-property']) || 'data';
  const VALID_NAMES = [dataProperty, 'error'];

  if (!targetVal || typeof targetVal !== 'object') {
    return errors;
  }

  const path = context.path || [];
  const responsesIdx = path.lastIndexOf('responses');
  if (responsesIdx >= 0 && path[responsesIdx + 1] !== '201') {
    return errors;
  }

  for (const [propName, propValue] of Object.entries(targetVal)) {
    if (!VALID_NAMES.includes(propName)) {
      errors.push({
        message: `OAR038: Response property must be named '${dataProperty}' or 'error'. Got '${propName}'.`,
        path: [propName]
      });
    } else {
      const subProps = propValue && propValue.properties;
      const hasSubProps = subProps && Object.keys(subProps).length > 0;
      if (!hasSubProps) {
        errors.push({
          message: `OAR038: Property '${propName}' must have at least one sub-property.`,
          path: [propName]
        });
      }
    }
  }

  return errors;
};
