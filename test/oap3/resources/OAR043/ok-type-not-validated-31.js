module.exports = {
  "openapi": "3.1.0",
  "info": {
    "version": "1.0.0",
    "title": "OAR043 type is never validated for 3.1"
  },
  "paths": {
    "/orders": {
      "get": {
        "parameters": [
          {
            "name": "status",
            "in": "query",
            "schema": { "type": ["string", "int"] }
          },
          {
            "name": "limit",
            "in": "query",
            "schema": { "type": "float" }
          },
          {
            "name": "tag",
            "in": "query",
            "schema": { "type": "not-a-real-type" }
          }
        ],
        "responses": {
          "200": { "description": "OK" }
        }
      }
    }
  }
};
