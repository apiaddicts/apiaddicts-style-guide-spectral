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
            "description": "No headers - missing x-api-key"
          }
        }
      }
    },
    "/users": {
      "put": {
        "responses": {
          "200": {
            "description": "Only allowed header - still missing x-api-key",
            "headers": {
              "traceId": {
                "schema": {
                  "type": "string"
                }
              }
            }
          }
        }
      }
    },
    "/orders": {
      "post": {
        "responses": {
          "200": {
            "description": "Has x-api-key but also forbidden header",
            "headers": {
              "x-api-key": {
                "schema": {
                  "type": "string"
                }
              },
              "server": {
                "schema": {
                  "type": "string"
                }
              }
            }
          }
        }
      }
    },
    "/items": {
      "delete": {
        "responses": {
          "200": {
            "description": "Has x-api-key but also forbidden header",
            "headers": {
              "x-api-key": {
                "schema": {
                  "type": "string"
                }
              },
              "authorization": {
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
