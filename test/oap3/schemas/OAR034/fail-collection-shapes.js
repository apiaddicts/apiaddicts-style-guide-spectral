module.exports = {
  "openapi": "3.0.3",
  "info": {
    "title": "Insurance Policy API",
    "version": "1.0.0"
  },
  "paths": {
    "/catalog/summary": {
      "get": {
        "responses": {
          "200": {
            "description": "Ok",
            "content": {
              "application/json": {
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
                    "attachments": {
                      "type": "array",
                      "items": {
                        "type": "string"
                      }
                    },
                    "roles": {
                      "type": "array",
                      "items": {
                        "type": "string"
                      }
                    },
                    "data": {
                      "type": "object",
                      "properties": {
                        "count": {
                          "type": "integer"
                        }
                      }
                    },
                    "content": {
                      "type": "string"
                    },
                    "items": {
                      "type": "integer"
                    },
                    "results": {
                      "type": "object"
                    },
                    "values": {
                      "type": "string",
                      "enum": [
                        "A",
                        "B"
                      ]
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/catalog/forms/latest": {
      "get": {
        "responses": {
          "200": {
            "description": "Ok",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "name": {
                      "type": "string"
                    },
                    "schema": {
                      "type": "object",
                      "properties": {
                        "data": {
                          "type": "array",
                          "items": {
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
    },
    "/catalog/anything": {
      "get": {
        "responses": {
          "200": {
            "description": "Ok",
            "content": {
              "application/json": {
                "schema": {}
              }
            }
          }
        }
      }
    },
    "/catalog/nothing": {
      "get": {
        "responses": {
          "200": {
            "description": "Nothing described"
          }
        }
      }
    },
    "/catalog/empty-content": {
      "get": {
        "responses": {
          "200": {
            "description": "Empty content",
            "content": {}
          }
        }
      }
    },
    "/catalog/no-schema": {
      "get": {
        "responses": {
          "200": {
            "description": "No schema",
            "content": {
              "application/json": {}
            }
          }
        }
      }
    },
    "/catalog/scalars": {
      "get": {
        "responses": {
          "200": {
            "description": "Scalars",
            "content": {
              "text/plain": {
                "schema": {
                  "type": "string"
                }
              },
              "application/octet-stream": {
                "schema": {
                  "type": "string",
                  "format": "binary"
                }
              },
              "application/json": {
                "schema": {
                  "type": "integer"
                }
              }
            }
          }
        }
      }
    },
    "/catalog/union": {
      "get": {
        "responses": {
          "200": {
            "description": "Ok",
            "content": {
              "application/json": {
                "schema": {
                  "oneOf": [
                    {
                      "type": "object",
                      "properties": {
                        "data": {
                          "type": "array",
                          "items": {
                            "type": "string"
                          }
                        }
                      }
                    },
                    {
                      "type": "object",
                      "properties": {
                        "title": {
                          "type": "string"
                        }
                      }
                    }
                  ]
                }
              }
            }
          }
        }
      }
    },
    "/catalog/not-a-schema": {
      "get": {
        "responses": {
          "200": {
            "description": "Malformed",
            "content": {
              "application/json": {
                "schema": "string"
              }
            }
          }
        }
      }
    }
  }
};
