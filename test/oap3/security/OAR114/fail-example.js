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
              "authorization": {
                "schema": {
                  "type": "string"
                }
              },
              "trace-id": {
                "schema": {
                  "type": "string"
                }
              }
            }
          }
        }
      }
    },
    "/users": {
      "put": {
        "responses": {
          "204": {
            "description": "No Content",
            "headers": {
              "server": {
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
