module.exports = {
  "openapi": "3.0.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore"
  },
  "paths": {
    "/everythingValid": {
      "get": {
        "parameters": [
          {
            "in": "query",
            "name": "limit",
            "schema": {
              "type": "integer",
              "example": 10
            }
          },
          {
            "in": "query",
            "name": "offset",
            "example": 0,
            "schema": { "type": "integer" }
          }
        ],
        "responses": {
          "200": {
            "description": "Valid example in schema",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "id": {
                      "type": "integer",
                      "example": 1
                    },
                    "nested": {
                      "type": "object",
                      "properties": {
                        "value": {
                          "type": "string",
                          "example": "abc"
                        }
                      }
                    },
                    "items": {
                      "type": "array",
                      "items": {
                        "type": "string",
                        "example": "item1"
                      }
                    }
                  }
                }
              }
            }
          },
          "201": {
            "description": "Valid examples object",
            "content": {
              "application/json": {
                "examples": {
                  "sample": {
                    "value": {
                      "id": 1
                    }
                  }
                }
              }
            }
          },
          "204": {
            "description": "No content"
          },
          "default": {
            "description": "Default error",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "example": { "message": "error" }
                }
              }
            }
          }
        }
      },
      "post": {
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "example": {
                  "name": "Pet"
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Created",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "name": {
                      "type": "string",
                      "example": "Dog"
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