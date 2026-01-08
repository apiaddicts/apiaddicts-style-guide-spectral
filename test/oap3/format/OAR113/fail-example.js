module.exports = {
  "openapi": "3.0.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore"
  },
  "paths": {
    "/no-field-anywhere": {
      "get": {
        "responses": {
          "200": {
            "description": "Missing everywhere",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object"
                }
              }
            }
          }
        }
      }
    },
    "/get-only": {
      "get": {
        "responses": {
          "200": {
            "description": "Missing field"
          }
        }
      }
    },
    "/post-ignored-get-fails": {
      "post": {
        "responses": {
          "200": {
            "description": "Ignored"
          }
        }
      },
      "get": {
        "responses": {
          "200": {
            "description": "Fails"
          }
        }
      }
    },
    "/multiple-responses": {
      "get": {
        "responses": {
          "200": {
            "description": "Fails"
          },
          "404": {
            "description": "Ignored"
          }
        }
      }
    },
    "/deep-schema": {
      "get": {
        "responses": {
          "200": {
            "description": "Fails",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "a": {
                      "type": "object",
                      "properties": {
                        "b": {
                          "type": "string"
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};