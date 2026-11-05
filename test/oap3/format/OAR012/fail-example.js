module.exports = {
  "openapi": "3.0.3",
  "info": {
    "title": "Customer Management API",
    "version": "2.4.0"
  },
  "paths": {
    "/customers/{customerId}": {
      "parameters": [
        {
          "name": "customerId",
          "in": "path",
          "required": true,
          "schema": {
            "type": "string"
          }
        },
        {
          "name": "X-Correlation-Id",
          "in": "header",
          "schema": {
            "type": "string"
          }
        }
      ],
      "get": {
        "parameters": [
          {
            "name": "includeInactive",
            "in": "query",
            "schema": {
              "type": "boolean"
            }
          },
          {
            "name": "sessionToken",
            "in": "cookie",
            "schema": {
              "type": "string"
            }
          },
          {
            "$ref": "#/components/parameters/pageSize"
          },
          {
            "name": "filter",
            "in": "query",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "minBalance": {
                      "type": "number"
                    }
                  }
                }
              }
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Customer",
            "headers": {
              "X-Rate-Limit": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "remainingCalls": {
                      "type": "integer"
                    }
                  }
                }
              }
            },
            "content": {
              "application/json": {
                "schema": {
                  "allOf": [
                    {
                      "$ref": "#/components/schemas/base_entity"
                    },
                    {
                      "type": "object",
                      "properties": {
                        "fullName": {
                          "type": "string"
                        },
                        "contact_details": {
                          "type": "object",
                          "properties": {
                            "phoneNumber": {
                              "type": "string"
                            }
                          }
                        }
                      }
                    }
                  ]
                },
                "example": {
                  "exampleOnlyKey": "value"
                }
              },
              "application/xml": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "xmlName": {
                      "type": "string"
                    }
                  }
                }
              }
            }
          },
          "default": {
            "$ref": "#/components/responses/problem"
          },
          "x-internalResponse": {
            "description": "Extension",
            "content": {
              "application/json": {
                "schema": {
                  "properties": {
                    "extensionProp": {
                      "type": "string"
                    }
                  }
                }
              }
            }
          }
        }
      },
      "put": {
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "oneOf": [
                  {
                    "type": "object",
                    "properties": {
                      "homeAddress": {
                        "type": "string"
                      }
                    }
                  },
                  {
                    "type": "object",
                    "properties": {
                      "postal_code": {
                        "type": "string"
                      }
                    }
                  }
                ],
                "anyOf": [
                  {
                    "properties": {
                      "taxId": {
                        "type": "string"
                      }
                    }
                  }
                ],
                "not": {
                  "type": "object",
                  "properties": {
                    "notChecked": {
                      "type": "string"
                    }
                  }
                }
              },
              "encoding": {
                "homeAddress": {
                  "headers": {
                    "X-Part": {
                      "schema": {
                        "type": "object",
                        "properties": {
                          "partNumber": {
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
        },
        "responses": {
          "204": {
            "description": "Updated"
          }
        }
      },
      "trace": {
        "parameters": [
          {
            "name": "traceLevel",
            "in": "query",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Trace"
          }
        }
      }
    },
    "/customers": {
      "post": {
        "requestBody": {
          "$ref": "#/components/requestBodies/customer_body"
        },
        "callbacks": {
          "customer_events": {
            "{$request.body#/callback_url}": {
              "post": {
                "parameters": [
                  {
                    "name": "deliveryId",
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
                          "eventType": {
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
            "x-callbackMeta": {
              "post": {
                "parameters": [
                  {
                    "name": "extensionParam",
                    "in": "query"
                  }
                ]
              }
            }
          },
          "status_changed": {
            "$ref": "#/components/callbacks/status_changed"
          }
        },
        "responses": {
          "201": {
            "description": "Created",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "createdId": {
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
    },
    "x-internalPaths": {
      "get": {
        "parameters": [
          {
            "name": "extensionPath",
            "in": "query"
          }
        ]
      }
    }
  },
  "components": {
    "schemas": {
      "base_entity": {
        "type": "object",
        "properties": {
          "createdAt": {
            "type": "string",
            "format": "date-time"
          },
          "audit_info": {
            "type": "object",
            "properties": {
              "lastModifiedBy": {
                "type": "string"
              }
            }
          },
          "tags": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "tagLabel": {
                  "type": "string"
                }
              }
            }
          },
          "metadata": {
            "type": "object",
            "additionalProperties": {
              "type": "object",
              "properties": {
                "extraValue": {
                  "type": "string"
                }
              }
            }
          },
          "$filter": {
            "type": "string"
          }
        }
      },
      "CustomerProfile": {
        "type": "object",
        "properties": {
          "display_name": {
            "type": "string"
          }
        }
      },
      "unused_model": {
        "type": "object",
        "properties": {
          "unusedField": {
            "type": "string"
          }
        }
      }
    },
    "parameters": {
      "pageSize": {
        "name": "pageSize",
        "in": "query",
        "schema": {
          "type": "integer"
        }
      },
      "unused_filter": {
        "name": "statusFilter",
        "in": "query",
        "schema": {
          "type": "string"
        }
      },
      "tenant_header": {
        "name": "X-Tenant",
        "in": "header",
        "schema": {
          "type": "string"
        }
      }
    },
    "requestBodies": {
      "customer_body": {
        "content": {
          "application/json": {
            "schema": {
              "type": "object",
              "properties": {
                "nickName": {
                  "type": "string"
                }
              }
            }
          }
        }
      }
    },
    "responses": {
      "problem": {
        "description": "Problem",
        "content": {
          "application/problem+json": {
            "schema": {
              "type": "object",
              "properties": {
                "errorCode": {
                  "type": "string"
                }
              }
            }
          }
        }
      }
    },
    "headers": {
      "trace_header": {
        "schema": {
          "type": "object",
          "properties": {
            "spanId": {
              "type": "string"
            }
          }
        }
      }
    },
    "callbacks": {
      "status_changed": {
        "{$request.body#/status_url}": {
          "post": {
            "requestBody": {
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "newStatus": {
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
    }
  }
};
