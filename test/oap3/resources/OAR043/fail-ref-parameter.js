module.exports = {
  "openapi": "3.0.0",
  "info": {
    "version": "1.0.0",
    "title": "OAR043 fail ref parameter"
  },
  "paths": {
    "/orders": {
      "get": {
        "parameters": [
          { "$ref": "#/components/parameters/BadStatus" }
        ],
        "responses": {
          "200": { "description": "OK" }
        }
      }
    }
  },
  "components": {
    "parameters": {
      "BadStatus": {
        "name": "status",
        "in": "headers",
        "schema": { "type": "string" }
      }
    }
  }
};
