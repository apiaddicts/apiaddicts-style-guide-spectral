module.exports = {
  "swagger": "2.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore Multiple Mandatory Codes"
  },
  "paths": {
    "/pets": {
      "get": {
        "responses": {
          "200": { "description": "OK", "schema": { "type": "object" } },
          "202": { "description": "Accepted", "schema": { "type": "object" } },
          "206": { "description": "Partial content", "schema": { "type": "object" } }
        }
      }
    }
  }
};
