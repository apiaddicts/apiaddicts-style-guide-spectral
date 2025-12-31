module.exports = {
  "openapi": "3.0.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore"
  },
  "components": {
    "responses": {
      "BadResponse": {
        "description": "Referenced response without headers"
      },
      "ForbiddenHeadersResponse": {
        "description": "Has forbidden headers",
        "headers": {
          "authorization": {
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
            "$ref": "#/components/responses/BadResponse"
          },
          "400": {
            "$ref": "#/components/responses/ForbiddenHeadersResponse"
          }
        }
      }
    },
    "/orders": {
      "post": {
        "responses": {
          "200": {
            "description": "Inline headers but missing mandatory",
            "headers": {
              "x-power-by": {
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
          "200": {
            "description": "Mixed allowed and forbidden",
            "headers": {
              "x-trace-id": {
                "schema": {
                  "type": "string"
                }
              },
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