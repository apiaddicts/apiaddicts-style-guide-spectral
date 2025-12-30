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
            "description": "Valid headers",
            "headers": {
              "x-trace-id": {
                "type": "string"
              },
              "x-request-id": {
                "type": "string"
              },
            }
          }
        }
      }
    },
    "/orders": {
      "post": {
        "responses": {
          "200": {
            "description": "Multiple allowed headers",
            "headers": {
              "x-trace-id": {
                "type": "string"
              },
              "x-request-id": {
                "type": "string"
              },
              "x-power-by": {
                "type": "string"
              },
              "idCorrelacion": {
                "type": "string"
              }
            }
          }
        }
      }
    },
    "/customers": {
      "get": {
        "responses": {
          "204": {
            "description": "No content and excluded"
          }
        }
      }
    },
    "/status": {
      "get": {
        "responses": {
          "200": {
            "description": "Excluded path",
            "headers": {
              "x-forbidden-header": {
                "type": "string"
              }
            }
          }
        }
      }
    }
  }
};