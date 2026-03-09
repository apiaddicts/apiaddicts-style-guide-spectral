module.exports = {
  "openapi": "3.0.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore"
  },
  "paths": {
    "/invoices": {
      "get": {
        "responses": {
          "206": {
            "description": "missing orderby"
          }
        }
      }
    },
    "/transactions": {
      "get": {
        "parameters": [],
        "responses": {
          "206": {
            "description": "missing orderby"
          }
        }
      }
    }
  }
};