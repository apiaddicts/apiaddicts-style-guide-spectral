module.exports = {
  "openapi": "3.0.1",
  "info": {
    "title": "Swagger Petstore",
    "version": "1.0.0"
  },
  "paths": {
    "/pets": {
      "get": {
        "parameters": [
          {
            "in": "query",
            "name": "$total",
            "required": false,
            "schema": {
              "type": "boolean",
              "default": false
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
