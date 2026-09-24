module.exports = {
  "openapi": "3.1.0",
  "info": {
    "version": "1.0.0",
    "title": "OAR043 nullable array type ok"
  },
  "paths": {
    "/orders": {
      "get": {
        "parameters": [
          {
            "name": "status",
            "in": "query",
            "schema": { "type": ["string", "null"] }
          },
          {
            "name": "count",
            "in": "query",
            "schema": { "type": ["integer", "null"] }
          }
        ],
        "responses": {
          "200": { "description": "OK" }
        }
      }
    }
  }
};
