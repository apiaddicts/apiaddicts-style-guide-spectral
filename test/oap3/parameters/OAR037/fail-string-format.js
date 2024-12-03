module.exports = {
  "openapi": "3.0.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore"
  },
  "components": {
    "parameters": {
      "paramOne": {
        "in": "header",
        "name": "paramOne",
        "schema": {
          "type": "string",
          "format": "dateTime",
          "maxLength": 100
        }
      },
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
        "parameters": [
          {
            "$ref": "#/components/parameters/paramOne"
          }
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
                    "date": {
                      "type": "string",
                      "format": "date"
                    },
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
                    "binary": {
                      "type": "string",
                      "format": "binary"
                    },
                    "email": {
                      "type": "string",
                      "format": "email"
                    },
                    "uuid": {
                      "type": "string",
                      "format": "uuid"
                    },
                    "uri": {
                      "type": "string",
                      "format": "uri"
                    },
                    "hostname": {
                      "type": "string",
                      "format": "hostname"
                    },
                    "ipv4": {
                      "type": "string",
                      "format": "ipv4"
                    },
                    "ipv6": {
                      "type": "string",
                      "format": "ipv6"
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
            "name": "paramFive",
            "schema": {
              "type": "string",
              "format": "date"
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
                  "date": {
                    "type": "string",
                    "format": "date"
                  },
                  "date-time": {
                    "type": "string",
                    "format": "date-time"
                  },
                  "password": {
                    "type": "string",
                    "format": "password"
                  },
                  "byte": {
                    "type": "string",
                    "format": "byte"
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
                    },
                    "date": {
                      "type": "string",
                      "format": "date"
                    },
                    "date-time": {
                      "type": "string",
                      "format": "date-time"
                    },
                    "password": {
                      "type": "string",
                      "format": "password"
                    },
                    "byte": {
                      "type": "string",
                      "format": "byte"
                    },
                    "binary": {
                      "type": "string",
                      "format": "binary"
                    },
                    "email": {
                      "type": "string",
                      "format": "email"
                    },
                    "uuid": {
                      "type": "string",
                      "format": "uuid"
                    },
                    "uri": {
                      "type": "string",
                      "format": "uri"
                    },
                    "hostname": {
                      "type": "string",
                      "format": "hostname"
                    },
                    "ipv4": {
                      "type": "string",
                      "format": "ipv4"
                    },
                    "ipv6": {
                      "type": "string",
                      "format": "ipv6"
                    },
                    "other": {
                      "type": "array",
                      "items": {
                        "type": "string",
                        "format": "other"
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
    "/invoices/{invoiceId}": {
      "get": {
        "parameters": [
          {
            "in": "path",
            "name": "invoiceId",
            "schema": {
              "type": "string",
              "maxLength": 100
            }
          },
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
            "name": "paramFive",
            "schema": {
              "type": "string",
              "format": "date"
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
                    "date": {
                      "type": "string",
                      "format": "date"
                    },
                    "date-time": {
                      "type": "string",
                      "format": "date-time"
                    },
                    "password": {
                      "type": "string",
                      "format": "password"
                    },
                    "byte": {
                      "type": "string",
                      "format": "byte"
                    },
                    "binary": {
                      "type": "string",
                      "format": "binary"
                    },
                    "email": {
                      "type": "string",
                      "format": "email"
                    },
                    "uuid": {
                      "type": "string",
                      "format": "uuid"
                    },
                    "uri": {
                      "type": "string",
                      "format": "uri"
                    },
                    "hostname": {
                      "type": "string",
                      "format": "hostname"
                    },
                    "ipv4": {
                      "type": "string",
                      "format": "ipv4"
                    },
                    "ipv6": {
                      "type": "string",
                      "format": "ipv6"
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