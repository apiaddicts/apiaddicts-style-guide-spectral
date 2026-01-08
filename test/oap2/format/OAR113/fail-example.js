module.exports = {
  "swagger": "2.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore"
  },
  "paths": {
    "/invoices-no-field-anywhere": {
      "get": {
        "responses": {
          "200": {
            "description": "No field at any level"
          }
        }
      }
    },
    "/path-has-no-field-operation-has-no-field": {
      "get": {
        "responses": {
          "200": {
            "description": "Still missing"
          }
        }
      }
    },
    "/operation-has-no-field-response-missing": {
      "get": {
        "description": "GET without custom field",
        "responses": {
          "200": {
            "description": "Missing here"
          }
        }
      }
    },
    "/multiple-methods-only-get-counts": {
      "post": {
        "responses": {
          "200": {
            "description": "Ignored (not GET)"
          }
        }
      },
      "get": {
        "responses": {
          "200": {
            "description": "GET response missing field"
          }
        }
      }
    },
    "/get-with-multiple-responses": {
      "get": {
        "responses": {
          "200": {
            "description": "Missing field"
          },
          "400": {
            "description": "Ignored (not 200)"
          }
        }
      }
    },
    "/deeply-nested-schema": {
      "get": {
        "responses": {
          "200": {
            "description": "Missing field",
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
  }
};
