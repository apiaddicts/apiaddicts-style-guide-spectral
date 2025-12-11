const { pattern } = require("@stoplight/spectral-functions");

const patterns = {
    "kebab-case": /^[a-z0-9]+(-[a-z0-9]+)*$/,
    "snake_case": /^[a-z0-9]+(_[a-z0-9]+)*$/,
    "camelCase": /^[a-z][a-zA-Z0-9]*$/,
    "upperCamelCase": /^[A-Z][a-zA-Z0-9]*$/
};

/**
 * @param {object} given
 * @param {object} options
 * @param {string} options.pattern
 * @param {import('@stoplight/spectral-core').RulesetFunctionContext} context
 */
module.exports = (given, options, context) => {
    if (!given) return [];

    const selected = patterns[options.pattern];

    if (!selected) {
        throw new Error(
            `OAR012: Unknown pattern "${options.pattern}". ` +
            `Allowed patterns are: ${Object.keys(patterns).join(", ")}`
        );
    }

    return pattern(given, { match: selected }, context) || [];
};