const { linterForRule } = require('../../helpers/utils');  // Asumiendo que tienes esta función para configurar el linter

let linter;

const oar108fail = require('./OAR108/fail-example');  // Ejemplo donde el esquema no coincide con el ejemplo
const oar108ok = require('./OAR108/ok-example');  // Ejemplo donde el esquema coincide con el ejemplo

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR108');  // Configuramos el linter para la regla OAR108
  return linter;
});

test('apiq:OAR108 should find errors', () => {
  return linter.run(oar108fail).then((results) => {
    expect(results.length).toBeGreaterThanOrEqual(1);  // Esperamos al menos un error
    expect(results[0].message).toBe("OAR108: Schema does not match the provided example.");
    expect(results[0].severity).toBe(0);  // La severidad de error debe ser 0 (error grave)
  });
});

test('apiq:OAR108 should find no errors', () => {
  return linter.run(oar108ok).then((results) => {
    expect(results.length).toBe(0);  // No se esperan errores si el ejemplo es correcto
  });
});
