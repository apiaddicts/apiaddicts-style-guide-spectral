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
    "/claims": {
      "get": {
        "responses": {
          "200": {
            "description": "Ok",
            "schema": {
              "type": "object",
              "properties": {
                "Items": {
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
    "/customers": {
      "get": {
        "responses": {
          "200": {
            "description": "Ok",
            "schema": {
              "type": "object",
              "x-nullable": true,
              "properties": {
                "results": {
                  "type": "array",
                  "items": {
                    "type": "string"
                  },
                  "x-nullable": true
                }
              }
            }
          }
        }
      }
    },
    "/tariffs": {
      "get": {
        "responses": {
          "206": {
            "description": "Ok",
            "schema": {
              "type": "object",
              "properties": {
                "content": {
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
    "/policies/{policyId}/claims": {
      "get": {
        "responses": {
          "200": {
            "description": "Ok",
            "schema": {
              "type": "object",
              "properties": {
                "records": {
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
    "/brokers": {
      "get": {
        "responses": {
          "200": {
            "description": "Ok",
            "schema": {
              "type": "array",
              "items": {
                "$ref": "#/definitions/Broker"
              }
            }
          }
        }
      }
    },
    "/regions": {
      "get": {
        "responses": {
          "200": {
            "description": "Ok",
            "schema": {
              "$ref": "#/definitions/RegionList"
            }
          }
        }
      }
    },
    "/branches": {
      "get": {
        "responses": {
          "200": {
            "description": "Ok",
            "schema": {
              "type": "object",
              "properties": {
                "data": {
                  "$ref": "#/definitions/RegionList"
                }
              }
            }
          }
        }
      }
    }
  },
  "definitions": {
    "Broker": {
      "type": "object",
      "properties": {
        "brokerId": {
          "type": "string"
        }
      }
    },
    "RegionList": {
      "type": "array",
      "items": {
        "type": "string"
      }
    }
  }
};
