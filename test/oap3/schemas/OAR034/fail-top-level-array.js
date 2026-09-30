module.exports = {
  "openapi": "3.0.3",
  "info": {
    "title": "Insurance Policy API",
    "version": "1.0.0"
  },
  "paths": {
    "/brokers": {
      "get": {
        "responses": {
          "200": {
            "description": "Ok",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/Broker"
                  }
                }
              }
            }
          }
        }
      }
    },
    "/agencies": {
      "get": {
        "responses": {
          "200": {
            "description": "Ok",
            "content": {
              "application/json": {
                "schema": {
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
    "/regions": {
      "get": {
        "responses": {
          "200": {
            "description": "Ok",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/RegionList"
                }
              }
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
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "nullable": true,
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
  },
  "components": {
    "schemas": {
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
  }
};
