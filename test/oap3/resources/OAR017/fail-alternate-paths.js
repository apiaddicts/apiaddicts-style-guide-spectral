module.exports = {
  "openapi": "3.0.1",
  "info": {
    "title": "Swagger Petstore",
    "version": "1.0.0"
  },
  "paths": {
    "/customers/{customerId}/{invoiceId}": {
      "get": {
        "parameters": [
          {
            "name": "customerId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer"
            }
          },
          {
            "name": "invoiceId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer"
            }
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
