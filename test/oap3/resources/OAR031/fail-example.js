module.exports = {
  "openapi": "3.0.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore"
  },
  "paths": {
    "/noExamplesAnywhere": {
      "get": {
        "parameters": [
          {
            "in": "query",
            "name": "limit",
            "schema": { "type": "integer" }
          },
          {
            "$ref": "#/components/parameters/IdParam"
          }
        ],
        "responses": {
          "200": {
            "description": "No example anywhere",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "id": { "type": "integer" },
                    "nested": {
                      "type": "object",
                      "properties": {
                        "value": { "type": "string" }
                      }
                    }
                  }
                }
              }
            }
          },
          "400": {
            "description": "Bad request without example",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "error": { "type": "string" }
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
            "$ref": "#/components/responses/ErrorResponse"
          }
        }
      }
    },
    "/requestBodyNoExample": {
      "post": {
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "name": { "type": "string" }
                }
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Created without example",
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
    }
  },
  "components": {
    "parameters": {
      "IdParam": {
        "in": "path",
        "name": "id",
        "required": true,
        "schema": {
          "type": "integer"
        }
      }
    },
    "responses": {
      "ErrorResponse": {
        "description": "Error without example",
        "content": {
          "application/json": {
            "schema": {
              "type": "object",
              "properties": {
                "message": { "type": "string" }
              }
            }
          }
        }
      }
    }
  }
};