/**
 * @param {string} targetVal
 * @param {object} options
 * @param {import('@stoplight/spectral-core').RulesetFunctionContext} context
 */
module.exports = (targetVal, options, context) => {
  const maxDepth = options.maxDepth ?? 3
  const ignore = options.ignoreSegments ?? []
  const segments = targetVal
    .split('/')
    .filter(Boolean)
    .filter(segment => !segment.startsWith('{') && !segment.endsWith('}'))
    .filter(segment => !ignore.includes(segment))

  const depth = segments.length;

  if (depth > maxDepth) {
    return [
      { message: context.rule.message }
    ]
  }
}