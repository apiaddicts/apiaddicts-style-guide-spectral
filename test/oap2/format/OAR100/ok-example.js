module.exports = {
  "swagger": "2.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore"
  },
  "host": "api.example.com",
  "schemes": ["https"],
  "basePath": "/api/v1",
  "paths": {
    "/invoices": {
      "get": {
        "responses": {
          "200": {
            "description": "An invoice."
          }
        }
      }
    }
  }
};