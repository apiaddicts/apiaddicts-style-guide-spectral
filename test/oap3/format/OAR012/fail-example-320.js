module.exports = {
  "openapi": "3.2.0",
  "info": {
    "title": "Market Quotes API",
    "version": "3.0.0"
  },
  "paths": {
    "/quotes": {
      "query": {
        "parameters": [
          {
            "name": "marketCode",
            "in": "query",
            "schema": {
              "type": "string"
            }
          }
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "symbolList": {
                    "type": "array",
                    "items": {
                      "type": "string"
                    }
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Quotes",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "lastPrice": {
                      "type": "number"
                    }
                  }
                }
              }
            }
          }
        }
      },
      "get": {
        "parameters": [
          {
            "name": "searchQuery",
            "in": "querystring",
            "content": {
              "application/x-www-form-urlencoded": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "sortOrder": {
                      "type": "string"
                    },
                    "page_size": {
                      "type": "integer"
                    }
                  }
                }
              }
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Stream",
            "content": {
              "text/event-stream": {
                "itemSchema": {
                  "type": "object",
                  "properties": {
                    "eventData": {
                      "type": "string"
                    }
                  }
                }
              },
              "application/json": {
                "$ref": "#/components/mediaTypes/quote_list"
              }
            }
          }
        }
      },
      "additionalOperations": {
        "PURGE": {
          "parameters": [
            {
              "name": "cacheKey",
              "in": "query",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "204": {
              "description": "Purged"
            }
          }
        }
      }
    }
  },
  "webhooks": {
    "price_alert": {
      "additionalOperations": {
        "NOTIFY": {
          "requestBody": {
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "alertLevel": {
                      "type": "string"
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Received"
            }
          }
        }
      }
    }
  },
  "components": {
    "mediaTypes": {
      "quote_list": {
        "schema": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "bidPrice": {
                "type": "number"
              }
            }
          }
        }
      },
      "multipart_upload": {
        "schema": {
          "type": "object",
          "properties": {
            "file_name": {
              "type": "string"
            }
          }
        },
        "encoding": {
          "file_name": {
            "headers": {
              "X-Checksum": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "checksumAlgo": {
                      "type": "string"
                    }
                  }
                }
              }
            }
          }
        },
        "prefixEncoding": [
          {
            "headers": {
              "X-Part": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "partIndex": {
                      "type": "integer"
                    }
                  }
                }
              }
            }
          }
        ],
        "itemEncoding": {
          "headers": {
            "X-Item": {
              "schema": {
                "type": "object",
                "properties": {
                  "itemTag": {
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
};
