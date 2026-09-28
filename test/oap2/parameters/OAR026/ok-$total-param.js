module.exports = {
  "swagger": "2.0",
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
            "type": "boolean",
            "default": false
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
