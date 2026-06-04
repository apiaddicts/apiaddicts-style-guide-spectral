module.exports = {
  "swagger": "2.0",
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
              "dateTime": {
                "type": "string"
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
                "type": "string"
              },
              "server": {
                "type": "string"
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
                "type": "string"
              },
              "authorization": {
                "type": "string"
              }
            }
          }
        }
      }
    }
  }
};
