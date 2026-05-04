/**
 * @param {object} given                   
 * @param {object} options                 
 * @param {string} options.property        
 * @param {string} options.equalTo         
 * @param {string} options.result          
 * @param {import('@stoplight/spectral-core').RulesetFunctionContext} context    
 *                                         
 */
module.exports = (given, options, context) => {
  const errors = [];
  if (!given) {
    return errors;
  }

  const propA = given[options.property];
  const propB = given[options.equalTo];

  if (
    typeof propA === 'string' &&
    typeof propB === 'string' &&
    options.result === 'falsy' &&
    propA.trim().toUpperCase() === propB.trim().toUpperCase()
  ) {
    errors.push({
      message: context.rule.message,
      path: [...context.path, options.property]
    });
  }

  return errors;
};

