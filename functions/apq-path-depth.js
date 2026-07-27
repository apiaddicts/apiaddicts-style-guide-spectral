/**
 * @param {string} targetVal
 * @param {object} options
 * @param {import('@stoplight/spectral-core').RulesetFunctionContext} context
 */
module.exports = (targetVal, options, context) => {
  const minDepth = options['min-level'] ?? options.minDepth ?? null
  const maxDepth = options['max-level'] ?? options['max-level-allowed'] ?? options.maxDepth ?? 3
  const ignore = options.ignoreSegments ?? []
  const segments = targetVal
    .split('/')
    .filter(Boolean)
    .filter(segment => !segment.startsWith('{') && !segment.endsWith('}'))
    .filter(segment => !ignore.includes(segment))

  const depth = segments.length;

  const isOutOfRange = minDepth != null
    ? (depth >= minDepth && depth <= maxDepth)
    : depth > maxDepth

  if (isOutOfRange) {
    const message = minDepth != null
      ? `OAR014: Path depth (${depth}) must not fall within the non-suggested range ${minDepth}-${maxDepth}.`
      : `OAR015: Path depth (${depth}) exceeds the maximum allowed level of ${maxDepth}.`
    return [
      { message }
    ]
  }
}