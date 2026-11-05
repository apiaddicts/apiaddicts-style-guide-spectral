module.exports = {
  "openapi": "3.0.3",
  "info": {
    "title": "Customer Onboarding API",
    "version": "1.4.0"
  },
  "servers": [
    {
      "url": "https://api.example.com/onboarding/v1",
      "description": "single words and a version"
    },
    {
      "url": "https://api.example.com/customer-onboarding/v2.1",
      "description": "kebab-case"
    },
    {
      "url": "https://api.example.com/customer_onboarding/v2",
      "description": "snake_case"
    },
    {
      "url": "https://api.example.com/customerOnboarding/v1",
      "description": "camelCase"
    },
    {
      "url": "https://api.example.com/CustomerOnboarding/V1",
      "description": "UpperCamelCase"
    },
    {
      "url": "https://{region}.example.com/{basePath}",
      "description": "variables only",
      "variables": {
        "region": {
          "default": "eu-west"
        },
        "basePath": {
          "default": "onboarding/v1"
        }
      }
    }
  ],
  "paths": {
    "/customers": {
      "get": {
        "operationId": "operation1",
        "summary": "Operation on /customers",
        "responses": {
          "200": {
            "description": "Operation on /customers",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Envelope"
                }
              }
            }
          },
          "default": {
            "description": "Unexpected error"
          }
        }
      }
    },
    "/Customers": {
      "get": {
        "operationId": "operation2",
        "summary": "Operation on /Customers",
        "responses": {
          "200": {
            "description": "Operation on /Customers",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Envelope"
                }
              }
            }
          },
          "default": {
            "description": "Unexpected error"
          }
        }
      }
    },
    "/identity-documents": {
      "get": {
        "operationId": "operation3",
        "summary": "Operation on /identity-documents",
        "responses": {
          "200": {
            "description": "Operation on /identity-documents",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Envelope"
                }
              }
            }
          },
          "default": {
            "description": "Unexpected error"
          }
        }
      }
    },
    "/identity_documents": {
      "get": {
        "operationId": "operation4",
        "summary": "Operation on /identity_documents",
        "responses": {
          "200": {
            "description": "Operation on /identity_documents",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Envelope"
                }
              }
            }
          },
          "default": {
            "description": "Unexpected error"
          }
        }
      }
    },
    "/identityDocuments": {
      "get": {
        "operationId": "operation5",
        "summary": "Operation on /identityDocuments",
        "responses": {
          "200": {
            "description": "Operation on /identityDocuments",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Envelope"
                }
              }
            }
          },
          "default": {
            "description": "Unexpected error"
          }
        }
      }
    },
    "/IdentityDocuments": {
      "get": {
        "operationId": "operation6",
        "summary": "Operation on /IdentityDocuments",
        "responses": {
          "200": {
            "description": "Operation on /IdentityDocuments",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Envelope"
                }
              }
            }
          },
          "default": {
            "description": "Unexpected error"
          }
        }
      }
    },
    "/customers/{customerId}/oauth2Tokens": {
      "get": {
        "operationId": "operation7",
        "summary": "Operation on /customers/{customerId}/oauth2Tokens",
        "parameters": [
          {
            "name": "customerId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Operation on /customers/{customerId}/oauth2Tokens",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Envelope"
                }
              }
            }
          },
          "default": {
            "description": "Unexpected error"
          }
        }
      }
    },
    "/customers/Orders": {
      "get": {
        "operationId": "operation8",
        "summary": "Operation on /customers/Orders",
        "responses": {
          "200": {
            "description": "Operation on /customers/Orders",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Envelope"
                }
              }
            }
          },
          "default": {
            "description": "Unexpected error"
          }
        }
      }
    },
    "/customerID": {
      "get": {
        "operationId": "operation9",
        "summary": "Operation on /customerID",
        "responses": {
          "200": {
            "description": "Operation on /customerID",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Envelope"
                }
              }
            }
          },
          "default": {
            "description": "Unexpected error"
          }
        }
      }
    },
    "/{tenantId}": {
      "get": {
        "operationId": "operation10",
        "summary": "Operation on /{tenantId}",
        "parameters": [
          {
            "name": "tenantId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Operation on /{tenantId}",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Envelope"
                }
              }
            }
          },
          "default": {
            "description": "Unexpected error"
          }
        }
      }
    },
    "/documents/{documentId}.pdf": {
      "get": {
        "operationId": "operation11",
        "summary": "Operation on /documents/{documentId}.pdf",
        "parameters": [
          {
            "name": "documentId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Operation on /documents/{documentId}.pdf",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Envelope"
                }
              }
            }
          },
          "default": {
            "description": "Unexpected error"
          }
        }
      }
    },
    "/Documents/{DocumentId}.pdf": {
      "get": {
        "operationId": "operation12",
        "summary": "Operation on /Documents/{DocumentId}.pdf",
        "parameters": [
          {
            "name": "DocumentId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Operation on /Documents/{DocumentId}.pdf",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Envelope"
                }
              }
            }
          },
          "default": {
            "description": "Unexpected error"
          }
        }
      }
    },
    "/reports/v2.1/summary": {
      "get": {
        "operationId": "operation13",
        "summary": "Operation on /reports/v2.1/summary",
        "responses": {
          "200": {
            "description": "Operation on /reports/v2.1/summary",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Envelope"
                }
              }
            }
          },
          "default": {
            "description": "Unexpected error"
          }
        }
      }
    },
    "/users/{userId}:activate": {
      "get": {
        "operationId": "operation14",
        "summary": "Operation on /users/{userId}:activate",
        "parameters": [
          {
            "name": "userId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Operation on /users/{userId}:activate",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Envelope"
                }
              }
            }
          },
          "default": {
            "description": "Unexpected error"
          }
        }
      }
    },
    "/payment-methods/{paymentMethodId}/card_details": {
      "get": {
        "operationId": "operation15",
        "summary": "Operation on /payment-methods/{paymentMethodId}/card_details",
        "parameters": [
          {
            "name": "paymentMethodId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Operation on /payment-methods/{paymentMethodId}/card_details",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Envelope"
                }
              }
            }
          },
          "default": {
            "description": "Unexpected error"
          }
        }
      }
    },
    "/.well-known/openid-configuration": {
      "get": {
        "operationId": "operation16",
        "summary": "Operation on /.well-known/openid-configuration",
        "responses": {
          "200": {
            "description": "Operation on /.well-known/openid-configuration",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Envelope"
                }
              }
            }
          },
          "default": {
            "description": "Unexpected error"
          }
        }
      }
    },
    "/2024/statements": {
      "get": {
        "operationId": "operation17",
        "summary": "Operation on /2024/statements",
        "responses": {
          "200": {
            "description": "Operation on /2024/statements",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Envelope"
                }
              }
            }
          },
          "default": {
            "description": "Unexpected error"
          }
        }
      }
    },
    "x-internalRoutes": {
      "owner": "onboarding-team"
    }
  },
  "components": {
    "schemas": {
      "Envelope": {
        "type": "object",
        "properties": {
          "data": {
            "type": "object",
            "nullable": true
          }
        }
      }
    }
  }
};
