module.exports = {
  "openapi": "3.2.0",
  "info": {
    "version": "1.0.0",
    "title": "OAR043 querystring is valid in for 3.2"
  },
  "paths": {
    "/orders": {
      "get": {
        "parameters": [
          {
            "name": "status",
            "in": "querystring",
            "schema": { "type": "string" }
          }
        ],
        "responses": {
          "200": { "description": "OK" }
        }
      }
    }
  }
};
