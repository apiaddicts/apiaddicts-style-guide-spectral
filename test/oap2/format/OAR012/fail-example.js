module.exports = {
  "swagger": "2.0",
  "info": {
    "title": "Pet Store Legacy API",
    "version": "1.0.0"
  },
  "basePath": "/v1",
  "paths": {
    "/pets/{petId}": {
      "parameters": [
        {
          "name": "petId",
          "in": "path",
          "required": true,
          "type": "string"
        }
      ],
      "get": {
        "parameters": [
          {
            "name": "includeOwner",
            "in": "query",
            "type": "boolean"
          },
          {
            "name": "X-Api-Version",
            "in": "header",
            "type": "string"
          },
          {
            "$ref": "#/parameters/pageSize"
          }
        ],
        "responses": {
          "200": {
            "description": "Pet",
            "schema": {
              "allOf": [
                {
                  "$ref": "#/definitions/base_pet"
                },
                {
                  "type": "object",
                  "properties": {
                    "petName": {
                      "type": "string"
                    }
                  }
                }
              ]
            },
            "headers": {
              "X-Rate-Limit": {
                "type": "integer"
              }
            },
            "examples": {
              "application/json": {
                "exampleOnlyKey": 1
              }
            }
          },
          "default": {
            "$ref": "#/responses/error_response"
          },
          "x-internalResponse": {
            "description": "Extension",
            "schema": {
              "properties": {
                "extensionProp": {
                  "type": "string"
                }
              }
            }
          }
        }
      },
      "put": {
        "consumes": [
          "application/x-www-form-urlencoded"
        ],
        "parameters": [
          {
            "name": "ownerName",
            "in": "formData",
            "type": "string"
          }
        ],
        "responses": {
          "204": {
            "description": "Updated"
          }
        }
      },
      "post": {
        "parameters": [
          {
            "name": "pet",
            "in": "body",
            "schema": {
              "type": "object",
              "properties": {
                "birthDate": {
                  "type": "string"
                },
                "owner": {
                  "type": "object",
                  "properties": {
                    "ownerEmail": {
                      "type": "string"
                    }
                  }
                }
              }
            }
          }
        ],
        "responses": {
          "201": {
            "description": "Created",
            "schema": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "newId": {
                    "type": "string"
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  "parameters": {
    "pageSize": {
      "name": "pageSize",
      "in": "query",
      "type": "integer"
    },
    "unused_body": {
      "name": "body",
      "in": "body",
      "schema": {
        "type": "object",
        "properties": {
          "bodyField": {
            "type": "string"
          }
        }
      }
    }
  },
  "responses": {
    "error_response": {
      "description": "Error",
      "schema": {
        "type": "object",
        "properties": {
          "errorCode": {
            "type": "string"
          }
        }
      }
    }
  },
  "definitions": {
    "base_pet": {
      "type": "object",
      "properties": {
        "tagList": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "tagName": {
                "type": "string"
              }
            }
          }
        },
        "extra": {
          "type": "object",
          "additionalProperties": {
            "type": "object",
            "properties": {
              "extraKey": {
                "type": "string"
              }
            }
          }
        },
        "owner_ref": {
          "$ref": "#/definitions/PetOwner"
        }
      }
    },
    "PetOwner": {
      "type": "object",
      "properties": {
        "first_name": {
          "type": "string"
        },
        "pets": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/base_pet"
          }
        }
      }
    }
  },
  "x-models": {
    "ignored_model": {
      "properties": {
        "ignoredProp": {
          "type": "string"
        }
      }
    }
  }
};
