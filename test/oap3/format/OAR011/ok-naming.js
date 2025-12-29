module.exports = {
  "openapi": "3.0.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore"
  },
  "paths": {
    "/invoices/{id}/custom-detail": { // Compliant: todos los segmentos en kebab-case
      "get": {
        "parameters": [
          {
            "in": "path",
            "name": "id",
            "schema": {
              "type": "integer"
            },
            "required": true
          }
        ],
        "responses": {
          "200": {
            "description": "Ok"
          }
        }
      }
    }
  }
};
