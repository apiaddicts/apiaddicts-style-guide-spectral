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
            "name": "market_code",
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
                  "symbol_list": {
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
                    "last_price": {
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
                    "sort_order": {
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
                    "event_data": {
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
              "name": "cache_key",
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
                    "alert_level": {
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
              "bid_price": {
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
                    "checksum_algo": {
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
                    "part_index": {
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
                  "item_tag": {
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
