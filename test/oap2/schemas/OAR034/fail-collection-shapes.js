module.exports = {
  "swagger": "2.0",
  "info": {
    "title": "Catalog API",
    "version": "1.0.0"
  },
  "produces": [
    "application/json"
  ],
  "paths": {
    "/catalog/nothing": {
      "get": {
        "responses": {
          "200": {
            "description": "No schema"
          }
        }
      }
    },
    "/catalog/file": {
      "get": {
        "responses": {
          "200": {
            "description": "Ok",
            "schema": {
              "type": "file"
            }
          }
        }
      }
    },
    "/catalog/anything": {
      "get": {
        "responses": {
          "200": {
            "description": "Ok",
            "schema": {}
          }
        }
      }
    },
    "/catalog/summary": {
      "get": {
        "responses": {
          "200": {
            "description": "Ok",
            "schema": {
              "type": "object",
              "properties": {
                "summary": {
                  "type": "object",
                  "properties": {
                    "items": {
                      "type": "array",
                      "items": {
                        "type": "string"
                      }
                    }
                  }
                },
                "tags": {
                  "type": "array",
                  "items": {
                    "type": "string"
                  }
                },
                "data": {
                  "type": "object"
                },
                "items": {
                  "type": "integer"
                }
              }
            }
          }
        }
      }
    },
    "/catalog/scalars": {
      "get": {
        "responses": {
          "200": {
            "description": "Ok",
            "schema": {
              "type": "string"
            }
          }
        }
      }
    }
  }
};
