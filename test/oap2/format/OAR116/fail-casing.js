const op = { get: { responses: { 200: { description: 'OK' } } } };

// Used with pattern ^/[a-z0-9/{}-]+$ : /PetsCamel and /pets_snake fail; the rest pass.
module.exports = {
  swagger: '2.0',
  info: { version: '1.0.0', title: 'OAR116' },
  paths: {
    '/pets': op,
    '/pets/{id}': op,
    '/pets-kebab': op,
    '/PetsCamel': op,
    '/pets_snake': op,
  },
};
