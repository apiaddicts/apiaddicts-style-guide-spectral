const reported = require('./fail-reported-case');

const document = JSON.parse(JSON.stringify(reported));
document.paths['/customers'].get.parameters[0] = { $ref: '#/components/parameters/startParam' };
const { startSlate, ...rest } = document.components.parameters;
document.components.parameters = { startParam: startSlate, ...rest };

module.exports = document;
