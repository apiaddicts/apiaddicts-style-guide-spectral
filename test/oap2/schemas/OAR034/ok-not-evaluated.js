module.exports = {
  "swagger": "2.0",
  "info": {
    "title": "Insurance Policy API",
    "version": "1.0.0"
  },
  "produces": [
    "application/json"
  ],
  "paths": {
    "/policies": {
      "get": {
        "responses": {
          "204": {
            "description": "No content"
          },
          "304": {
            "description": "Not modified"
          },
          "400": {
            "description": "Ok",
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
          },
          "404": {
            "description": "Ok",
            "schema": {
              "type": "array",
              "items": {
                "type": "string"
              }
            }
          },
          "500": {
            "description": "Ok",
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
          },
          "default": {
            "description": "Ok",
            "schema": {
              "type": "array",
              "items": {
                "type": "string"
              }
            }
          }
        }
      },
      "post": {
        "responses": {
          "200": {
            "description": "Ok",
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
          },
          "201": {
            "description": "Ok",
            "schema": {
              "type": "array",
              "items": {
                "type": "string"
              }
            }
          }
        }
      },
      "put": {
        "responses": {
          "200": {
            "description": "Ok",
            "schema": {
              "type": "array",
              "items": {
                "type": "string"
              }
            }
          }
        }
      },
      "delete": {
        "responses": {
          "200": {
            "description": "Ok",
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
    },
    "/policies/{policyId}": {
      "get": {
        "responses": {
          "200": {
            "description": "Ok",
            "schema": {
              "type": "object",
              "properties": {
                "policyId": {
                  "type": "string"
                },
                "items": {
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
    },
    "/policies/{policyId}/coverages/{coverageCode}": {
      "get": {
        "responses": {
          "200": {
            "description": "Ok",
            "schema": {
              "type": "array",
              "items": {
                "type": "string"
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
    }
  }
};
