module.exports = {
  "openapi": "3.1.0",
  "info": {
    "title": "Logistics Shipments API",
    "version": "1.3.0"
  },
  "paths": {
    "/shipments": {
      "get": {
        "parameters": [
          {
            "name": "trackingCode",
            "in": "query",
            "schema": {
              "type": [
                "string",
                "null"
              ]
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Shipments",
            "content": {
              "application/json": {
                "schema": {
                  "type": [
                    "object",
                    "null"
                  ],
                  "properties": {
                    "shipmentId": {
                      "type": [
                        "string",
                        "null"
                      ]
                    },
                    "legs": {
                      "type": [
                        "array",
                        "null"
                      ],
                      "items": {
                        "type": [
                          "object",
                          "null"
                        ],
                        "properties": {
                          "legNumber": {
                            "type": "integer"
                          }
                        }
                      }
                    },
                    "route": {
                      "type": "array",
                      "prefixItems": [
                        {
                          "type": "object",
                          "properties": {
                            "originPort": {
                              "type": "string"
                            }
                          }
                        }
                      ]
                    },
                    "attributes": {
                      "type": "object",
                      "patternProperties": {
                        "^attr[A-Z]": {
                          "type": "object",
                          "properties": {
                            "attrValue": {
                              "type": "string"
                            }
                          }
                        }
                      }
                    },
                    "dims": {
                      "type": "object",
                      "dependentSchemas": {
                        "weight_unit": {
                          "properties": {
                            "weightUnit": {
                              "type": "string"
                            }
                          }
                        }
                      }
                    },
                    "opt": {
                      "type": "object",
                      "unevaluatedProperties": {
                        "type": "object",
                        "properties": {
                          "extraNote": {
                            "type": "string"
                          }
                        }
                      }
                    },
                    "rule": {
                      "if": {
                        "properties": {
                          "ifOnly": {
                            "const": "a"
                          }
                        }
                      },
                      "then": {
                        "properties": {
                          "thenField": {
                            "type": "string"
                          }
                        }
                      },
                      "else": {
                        "properties": {
                          "elseField": {
                            "type": "string"
                          }
                        }
                      }
                    },
                    "list": {
                      "type": "array",
                      "contains": {
                        "type": "object",
                        "properties": {
                          "containsField": {
                            "type": "string"
                          }
                        }
                      }
                    },
                    "forbiddenName": false,
                    "with_ref": {
                      "$ref": "#/components/schemas/carrier",
                      "properties": {
                        "siblingField": {
                          "type": "string"
                        }
                      },
                      "description": "Carrier with extras"
                    },
                    "names_only": {
                      "type": "object",
                      "propertyNames": {
                        "pattern": "^[a-z]+$"
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
  "webhooks": {
    "shipment_delivered": {
      "post": {
        "parameters": [
          {
            "name": "webhookId",
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
                  "deliveredAt": {
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
    },
    "shipment_delayed": {
      "$ref": "#/components/pathItems/delay_events"
    }
  },
  "components": {
    "schemas": {
      "carrier": {
        "type": "object",
        "properties": {
          "carrierName": {
            "type": "string"
          }
        },
        "$defs": {
          "contact": {
            "type": "object",
            "properties": {
              "contactEmail": {
                "type": "string"
              }
            }
          }
        }
      },
      "nullableAddress": {
        "type": [
          "object",
          "null"
        ],
        "properties": {
          "street_name": {
            "type": "string"
          }
        }
      }
    },
    "pathItems": {
      "delay_events": {
        "parameters": [
          {
            "name": "delayReason",
            "in": "query",
            "schema": {
              "type": "string"
            }
          }
        ],
        "post": {
          "requestBody": {
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "delayMinutes": {
                      "type": "integer"
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
  }
};
