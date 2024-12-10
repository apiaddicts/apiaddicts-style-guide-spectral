module.exports = {
  "openapi": "3.0.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore"
  },
  "components": {
    "parameters": {
      "paramTwo": {
        "in": "query",
        "name": "paramTwo",
        "schema": {
          "type": "number",
          "format": "^\d{3}-\d{2}-\d{4}$"
        }
      }
    }
  },
  "paths": {
    "/invoices": {
      "parameters": [
        {
          "$ref": "#/components/parameters/paramTwo"
        },
        {
          "in": "header",
          "name": "paramThree",
          "schema": {
            "type": "boolean",
            "format": "int32"
          }
        }
      ],
      "get": {
        "responses": {
          "200": {
            "description": "A invoice.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "date-time": {
                      "type": "number",
                      "format": "date-time"
                    },
                    "password": {
                      "type": "boolean",
                      "format": "password"
                    },
                    "byte": {
                      "type": "integer",
                      "format": "email"
                    },
                    "other": {
                      "type": "string"
                    }
                  }
                }
              }
            }
          }
        }
      },
      "post": {
        "parameters": [
          {
            "in": "query",
            "name": "paramFour",
            "schema": {
              "type": "string",
              "pattern": "^\d{3}-\d{2}-\d{4}$",
              "maxLength": 10000000
            }
          },
          {
            "in": "query",
            "name": "paramSix",
            "schema": {
              "type": "number",
              "format": "double"
            }
          },
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "without": {
                    "type": "string"
                  },
                  "date-time": {
                    "type": "string",
                    "format": "date-time"
                  },
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "A invoice.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "without": {
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
    "/invoices/{invoiceId}": {
      "get": {
        "parameters": [
          {
            "in": "query",
            "name": "paramSix",
            "schema": {
              "type": "number",
              "format": "double"
            }
          },
        ],
        "responses": {
          "200": {
            "description": "A invoice.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "without": {
                      "type": "string"
                    },
                    "other": {
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