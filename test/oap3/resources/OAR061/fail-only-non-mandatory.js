module.exports = {
  "openapi": "3.0.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore Only Non Mandatory"
  },
  "paths": {
    "/pets": {
      "get": {
        "responses": {
          "500": { "description": "Server error", "content": { "application/json": { "schema": { "type": "object" } } } }
        }
      }
    }
  }
};
