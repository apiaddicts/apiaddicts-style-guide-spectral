const PARAM_REGEX = /\{[^}{]*}/g;

const DEFAULT_AMBIGUOUS_NAMES =
  'elementos,instancias,recursos,valores,terminos,objetos,articulos,elements,instances,resources,values,terms,objects,items';

/**
 * @param {string} given - The path key (e.g. "/users/{id}/items")
 * @param {object} options
 * @param {string} options['ambiguous-names']
 * @param {import('@stoplight/spectral-core').RulesetFunctionContext} context
 */
module.exports = (given, options, context) => {
  if (typeof given !== 'string') {
    return [];
  }

  const forbiddenValues = new Set(
    ((options && options['ambiguous-names']) || DEFAULT_AMBIGUOUS_NAMES)
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean)
  );

  const pathWithoutParams = given.replace(PARAM_REGEX, '');
  const pathParts = pathWithoutParams.split('/').filter(Boolean);
  const forbidden = pathParts.filter((part) => forbiddenValues.has(part));

  if (forbidden.length === 0) {
    return [];
  }

  return [
    {
      message: `Ambiguous name(s) found in path: ${forbidden.join(', ')}.`,
      path: context.path
    }
  ];
};
