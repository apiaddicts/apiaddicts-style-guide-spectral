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
            "description": "Valid json response",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "amount": {
                      "type": "number",
                      "format": "decimal"
                    }
                  }
                }
              }
            }
          },
          "204": {
            "description": "Ignored"
          }
        }
      },
      "post": {
        "responses": {
          "200": {
            "description": "Multiple media types including json",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object"
                }
              },
              "application/xml": {
                "schema": {
                  "type": "object"
                }
              }
            }
          }
        }
      },
      "put": {
        "responses": {
          "200": {
            "description": "Nested complex schema",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "nested": {
                      "type": "object",
                      "properties": {
                        "id": {
                          "type": "integer"
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "patch": {
        "responses": {
          "200": {
            "description": "Json with additional formats",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "type": "object"
                  }
                }
              },
              "text/plain": {
                "schema": {
                  "type": "string"
                }
              }
            }
          }
        }
      },
      "delete": {
        "responses": {
          "200": {
            "description": "Simple valid json",
            "content": {
              "application/json": {
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