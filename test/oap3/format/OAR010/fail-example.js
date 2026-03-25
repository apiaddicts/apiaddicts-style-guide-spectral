module.exports = {
  "openapi": "3.0.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore"
  },
  "paths": {
    "/invoices": {
      "get": {
        "responses": {
          "200": {
            "description": "Missing content entirely"
          },
          "400": {
            "description": "Wrong media type",
            "content": {
              "application/xml": {
                "schema": {
                  "type": "object"
                }
              }
            }
          },
          "401": {
            "description": "Empty content",
            "content": {}
          },
          "402": {
            "description": "Content without json",
            "content": {
              "text/plain": {
                "schema": {
                  "type": "string"
                }
              }
            }
          },
          "204": {
            "description": "Should be ignored"
          }
        }
      },
      "post": {
        "responses": {
          "200": {
            "description": "Nested wrong structure",
            "content": {
              "application/xml": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "amount": {
                      "type": "number"
                    }
                  }
                }
              }
            }
          }
        }
      },
      "put": {
        "responses": {
          "200": {
            "description": "No application/json key",
            "content": {
              "application/pdf": {
                "schema": {
                  "type": "string",
                  "format": "binary"
                }
              }
            }
          }
        }
      },
      "patch": {
        "responses": {
          "200": {
            "description": "Content exists but wrong type",
            "content": {
              "image/png": {
                "schema": {
                  "type": "string",
                  "format": "binary"
                }
              }
            }
          }
        }
      },
      "delete": {
        "responses": {
          "200": {
            "description": "Another missing content"
          }
        }
      }
    }
  }
};