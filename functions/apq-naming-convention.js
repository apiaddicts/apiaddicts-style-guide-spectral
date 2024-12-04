const { pattern } = require("@stoplight/spectral-functions");

const patterns = {
    kebabCase: /^(\/|[a-z0-9-.]+|{[a-zA-Z0-9_]+})+$/,
    camelCase: /^[a-z]+([A-Z][a-z0-9]+)*$/,
    snakeCase: /^[a-z]+(_[a-z0-9]+)*$/,
    pascalCase: /^[A-Z]+([A-Z][a-z0-9]+)*$/
};

/**
 * @param {object} given
 * @param {object} options
 * @param {string} options.pattern
 * @param {import('@stoplight/spectral-core').RulesetFunctionContext} context
 */
module.exports = (given, options, context) => {
    const errors = [];
    if (!given) return errors;

    return pattern(given, { match: patterns[options.pattern] }, context);
}