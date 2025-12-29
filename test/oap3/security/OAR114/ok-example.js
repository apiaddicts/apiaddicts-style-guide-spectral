module.exports = {
  "openapi": "3.0.1",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore"
  },
  "paths": {
    "/pets": {
      "get": {
        "responses": {
          "200": {
            "description": "OK",
            "headers": {
              "x-api-key": {
                "schema": {
                  "type": "string"
                }
              },
              "x-trace-id": {
                "schema": {
                  "type": "string"
                }
              },
              "traceId": {
                "schema": {
                  "type": "string"
                }
              }
            }
          }
        }
      }
    }
  }
};
