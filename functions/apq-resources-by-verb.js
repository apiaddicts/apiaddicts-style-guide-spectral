const DEFAULT_ALLOWED_PATTERNS = `
;get:^/[^/{}]+$
;get:^/[^/{}]+/(\\{[^/{}]+\\}|\\bme\\b)/[^/{}]+$
;get:^/[^/{}]+/(\\{[^/{}]+\\}|\\bme\\b)/[^/{}]+/(\\{[^/{}]+\\}|\\bme\\b)/[^/{}]+$
;get:^/[^/{}]+/(\\{[^/{}]+\\}|\\bme\\b)$
;get:^/[^/{}]+/(\\{[^/{}]+\\}|\\bme\\b)/[^/{}]+/(\\{[^/{}]+\\}|\\bme\\b)$
;get:^/[^/{}]+/(\\{[^/{}]+\\}|\\bme\\b)/[^/{}]+/(\\{[^/{}]+\\}|\\bme\\b)/[^/{}]+/(\\{[^/{}]+\\}|\\bme\\b)$
;post:^/[^/{}]+$
;post:^/[^/{}]+/(\\{[^/{}]+\\}|\\bme\\b)/[^/{}]+$
;post:^/[^/{}]+/(\\{[^/{}]+\\}|\\bme\\b)/[^/{}]+/(\\{[^/{}]+\\}|\\bme\\b)/[^/{}]+$
;post:^/[^/{}]+/get$
;post:^/[^/{}]+/(\\{[^/{}]+\\}|\\bme\\b)/[^/{}]+/get$
;post:^/[^/{}]+/delete$
;post:^/[^/{}]+/(\\{[^/{}]+\\}|\\bme\\b)/[^/{}]+/delete$
;put:^/[^/{}]+/(\\{[^/{}]+\\}|\\bme\\b)$
;put:^/[^/{}]+/(\\{[^/{}]+\\}|\\bme\\b)/[^/{}]+/(\\{[^/{}]+\\}|\\bme\\b)$
;patch:^/[^/{}]+/(\\{[^/{}]+\\}|\\bme\\b)$
;patch:^/[^/{}]+/(\\{[^/{}]+\\}|\\bme\\b)/[^/{}]+/(\\{[^/{}]+\\}|\\bme\\b)$
;delete:^/[^/{}]+/(\\{[^/{}]+\\}|\\bme\\b)$
;delete:^/[^/{}]+/(\\{[^/{}]+\\}|\\bme\\b)/[^/{}]+/(\\{[^/{}]+\\}|\\bme\\b)$
`;

const parseAllowedPatterns = (patterns) =>
  patterns
    .split(';')
    .filter(Boolean)
    .map(entry => {
      const [verb, regex] = entry.split(':');
      return {
        verb: verb.toLowerCase(),
        regex: new RegExp(regex),
      };
    });

module.exports = (given, _, context) => {
  const results = [];
  if (!given || typeof given !== 'object') return results;

  const allowedPatterns = parseAllowedPatterns(DEFAULT_ALLOWED_PATTERNS);

  Object.entries(given).forEach(([path, operations]) => {
    Object.keys(operations || {}).forEach(verb => {
      const verbLower = verb.toLowerCase();
      if (!['get', 'post', 'put', 'patch', 'delete'].includes(verbLower)) return;

      const isAllowed = allowedPatterns.some(p =>
        p.verb === verbLower && p.regex.test(path)
      );

      if (!isAllowed) {
        results.push({
          message: context.rule.message
            .replace('{{path}}', path)
            .replace('{{verb}}', verbLower.toUpperCase()),
          path: [...context.path, path, verb],
        });
      }
    });
  });

  return results;
};