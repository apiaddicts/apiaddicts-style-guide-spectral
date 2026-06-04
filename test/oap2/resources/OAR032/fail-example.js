module.exports = {
  "swagger": "2.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore"
  },
  "paths": {
    "/users/items": {
      "get": {
        "responses": {
          "200": { "description": "OK" }
        }
      }
    },
    "/api/resources/{id}": {
      "get": {
        "parameters": [
          { "in": "path", "name": "id", "required": true, "type": "string" }
        ],
        "responses": {
          "200": { "description": "OK" }
        }
      }
    },
    "/data/objects/list": {
      "get": {
        "responses": {
          "200": { "description": "OK" }
        }
      }
    },
    "/catalog/values": {
      "get": {
        "responses": {
          "200": { "description": "OK" }
        }
      }
    }
  }
};
