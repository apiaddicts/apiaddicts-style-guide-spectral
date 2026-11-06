const reported = require('./fail-reported-case');

const document = JSON.parse(JSON.stringify(reported));
document.paths['/customers'].get.parameters[0] = { $ref: '#/parameters/startParam' };
document.parameters = {
  startParam: document.parameters.startSlate,
  limitParam: document.parameters.limitParam,
  totalParam: document.parameters.totalParam,
  onboardingStatusParam: document.parameters.onboardingStatusParam,
};

module.exports = document;
