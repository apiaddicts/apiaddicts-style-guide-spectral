module.exports = {
  "openapi": "3.0.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore"
  },
  "paths": {
    "/Invoices/{id}/CUSTOM_DETAIL": { // No compliant: segmentos con mayúsculas y guion bajo
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
