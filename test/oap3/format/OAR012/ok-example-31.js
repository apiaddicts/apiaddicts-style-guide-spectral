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
            "name": "tracking_code",
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
                    "shipment_id": {
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
                          "leg_number": {
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
                            "origin_port": {
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
                            "attr_value": {
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
                            "weight_unit": {
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
                          "extra_note": {
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
                          "then_field": {
                            "type": "string"
                          }
                        }
                      },
                      "else": {
                        "properties": {
                          "else_field": {
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
                          "contains_field": {
                            "type": "string"
                          }
                        }
                      }
                    },
                    "forbiddenName": false,
                    "with_ref": {
                      "$ref": "#/components/schemas/carrier",
                      "properties": {
                        "sibling_field": {
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
            "name": "webhook_id",
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
                  "delivered_at": {
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
          "carrier_name": {
            "type": "string"
          }
        },
        "$defs": {
          "contact": {
            "type": "object",
            "properties": {
              "contact_email": {
                "type": "string"
              }
            }
          }
        }
      },
      "nullable_address": {
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
            "name": "delay_reason",
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
                    "delay_minutes": {
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
