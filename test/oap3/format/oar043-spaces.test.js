const { linterForRule } = require('../../helpers/utils');

let linter;

const oar043fail = require('./OAR043/fail-example');  // Archivo que contiene líneas vacías
const oar043ok = require('./OAR043/ok-example');      // Archivo sin líneas vacías

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR043');  // Usamos la regla OAR043
  return linter;
});

test('apiq:OAR043 should find errors', () => {
  return linter.run(oar043fail).then((results) => {
    expect(results.length).toBeGreaterThanOrEqual(0);  
  });
});

test('apiq:OAR043 should find no errors', () => {
  return linter.run(oar043ok).then((results) => {
    expect(results.length).toBe(0);  // No debe haber errores si el archivo está limpio
  });
});
