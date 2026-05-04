module.exports = {
  "openapi": "3.0.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore"
  },
  "components": {
    "responses": {
      "ValidResponse": {
        "description": "Referenced response with valid headers",
        "headers": {
          "x-trace-id": {
            "schema": {
              "type": "string"
            }
          },
          "x-request-id": {
            "type": "string"
          },
          "x-power-by": {
            "schema": {
              "type": "string"
            }
          }
        }
      }
    }
  },
  "paths": {
    "/pets": {
      "get": {
        "responses": {
          "200": {
            "$ref": "#/components/responses/ValidResponse"
          }
        }
      }
    },
    "/orders": {
      "post": {
        "responses": {
          "200": {
            "description": "Inline valid headers",
            "headers": {
              "x-trace-id": {
                "schema": {
                  "type": "string"
                }
              },
              "x-request-id": {
                "type": "string"
              },
              "idCorrelacion": {
                "schema": {
                  "type": "string"
                }
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
            "description": "Excluded response code"
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
              "x-not-allowed": {
                "schema": {
                  "type": "string"
                }
              }
            }
          }
        }
      }
    },
    "/prueba": {
      "get": {
        "responses": {
          "200": {
            "description": "Excluded path",
            "headers": {
              "x-not-allowed": {
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