module.exports = {
  "openapi": "3.0.3",
  "info": {
    "title": "Customer Management API",
    "version": "2.4.0"
  },
  "paths": {
    "/customers/{customer_id}": {
      "parameters": [
        {
          "name": "customer_id",
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
            "name": "include_inactive",
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
            "$ref": "#/components/parameters/page_size"
          },
          {
            "name": "filter",
            "in": "query",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "min_balance": {
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
                    "remaining_calls": {
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
                        "full_name": {
                          "type": "string"
                        },
                        "contact_details": {
                          "type": "object",
                          "properties": {
                            "phone_number": {
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
                    "xml_name": {
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
                      "home_address": {
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
                      "tax_id": {
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
                "home_address": {
                  "headers": {
                    "X-Part": {
                      "schema": {
                        "type": "object",
                        "properties": {
                          "part_number": {
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
            "name": "trace_level",
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
                    "name": "delivery_id",
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
                          "event_type": {
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
                      "created_id": {
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
          "created_at": {
            "type": "string",
            "format": "date-time"
          },
          "audit_info": {
            "type": "object",
            "properties": {
              "last_modified_by": {
                "type": "string"
              }
            }
          },
          "tags": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "tag_label": {
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
                "extra_value": {
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
      "customer_profile": {
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
          "unused_field": {
            "type": "string"
          }
        }
      }
    },
    "parameters": {
      "page_size": {
        "name": "page_size",
        "in": "query",
        "schema": {
          "type": "integer"
        }
      },
      "unused_filter": {
        "name": "status_filter",
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
                "nick_name": {
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
                "error_code": {
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
            "span_id": {
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
                      "new_status": {
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
