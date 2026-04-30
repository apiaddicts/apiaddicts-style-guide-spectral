module.exports = (paths, options = {}, context) => {
  const results = [];

  if (!paths || typeof paths !== 'object') {
    return results;
  }

  // Get configuration options
  const statusEndpoint = (options['status-endpoint'] || '/status').trim();
  const method = (options['method'] || 'get').toLowerCase().trim();

  // Check if the endpoint exists
  if (!paths[statusEndpoint]) {
    results.push({
      message: `${context.rule.name.split(':').pop()}: The status endpoint '${statusEndpoint}' must be declared`,
      path: context.path,
    });
    return results;
  }

  const endpointNode = paths[statusEndpoint];

  // Check if the configured method exists
  if (!endpointNode[method]) {
    results.push({
      message: `${context.rule.name.split(':').pop()}: The status endpoint '${statusEndpoint}' must support the '${method.toUpperCase()}' method`,
      path: [...context.path, statusEndpoint],
    });
  }

  return results;
};
