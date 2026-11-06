module.exports = {
  "swagger": "2.0",
  "info": {
    "title": "Pet Store Legacy API",
    "version": "1.0.0"
  },
  "basePath": "/v1",
  "paths": {
    "/pets/{pet_id}": {
      "parameters": [
        {
          "name": "pet_id",
          "in": "path",
          "required": true,
          "type": "string"
        }
      ],
      "get": {
        "parameters": [
          {
            "name": "include_owner",
            "in": "query",
            "type": "boolean"
          },
          {
            "name": "X-Api-Version",
            "in": "header",
            "type": "string"
          },
          {
            "$ref": "#/parameters/page_size"
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
                    "pet_name": {
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
                "birth_date": {
                  "type": "string"
                },
                "owner": {
                  "type": "object",
                  "properties": {
                    "owner_email": {
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
                  "new_id": {
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
    "page_size": {
      "name": "page_size",
      "in": "query",
      "type": "integer"
    },
    "unused_body": {
      "name": "body",
      "in": "body",
      "schema": {
        "type": "object",
        "properties": {
          "body_field": {
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
          "error_code": {
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
        "tag_list": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "tag_name": {
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
              "extra_key": {
                "type": "string"
              }
            }
          }
        },
        "owner_ref": {
          "$ref": "#/definitions/pet_owner"
        }
      }
    },
    "pet_owner": {
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
