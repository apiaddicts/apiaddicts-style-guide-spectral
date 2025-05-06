/**
 * Comprueba la profundidad de una ruta y falla si supera `max`.
 *
 * @param {string} targetVal   — la ruta (clave de $.paths), p.ej. "/a/b/c"
 * @param {object} options     — aquí extraemos { max }
 * @param {object} context     — contexto de Spectral (para obtener la ruta JSON)
 * @returns {Array<object>}    — array vacío o con un objeto { message, path }
 */
module.exports = function apqDepth(targetVal, options, context) {
  const { max } = options;
  const results = [];

  // Solo cadenas válidas
  if (typeof targetVal !== 'string') {
    return results;
  }

  // Dividimos en segmentos filtrando entradas vacías
  // "/a/b/c" → ["a","b","c"]
  const parts = targetVal.split('/').filter(Boolean);

  if (parts.length > max) {
    results.push({
      message: `OAR014: La ruta “${targetVal}” tiene profundidad ${parts.length}, debe ser ≤ ${max}`,
      path: context.path, 
    });
  }

  return results;
};
