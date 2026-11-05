module.exports = {
  "openapi": "3.0.3",
  "info": {
    "title": "Customer Onboarding API",
    "version": "1.0.0",
    "description": "Paths and server URLs written in snake_case."
  },
  "servers": [
    {
      "url": "https://api-dev.heytrade.com/onboarding/v1",
      "description": "Development server."
    },
    {
      "url": "https://api-pre.heytrade.com/onboarding/v1",
      "description": "Pre-production server."
    },
    {
      "url": "https://api.heytrade.com/onboarding/v1",
      "description": "Production server."
    },
    {
      "url": "https://sandbox.heytrade.com/customer_onboarding/v2.1",
      "description": "Sandbox with the next minor version."
    }
  ],
  "paths": {
    "/customers": {
      "get": {
        "operationId": "listCustomers",
        "summary": "List customers",
        "tags": [
          "Onboarding"
        ],
        "responses": {
          "200": {
            "description": "List customers",
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
      },
      "post": {
        "operationId": "createCustomers",
        "summary": "Create customers",
        "tags": [
          "Onboarding"
        ],
        "responses": {
          "201": {
            "description": "Create customers",
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
    "/customers/{customer_id}": {
      "get": {
        "operationId": "readCustomer",
        "summary": "Get customer",
        "tags": [
          "Onboarding"
        ],
        "parameters": [
          {
            "name": "customer_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Get customer",
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
      },
      "patch": {
        "operationId": "updateCustomer",
        "summary": "Update customer",
        "tags": [
          "Onboarding"
        ],
        "parameters": [
          {
            "name": "customer_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Update customer",
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
    "/customers/{customer_id}/identity_documents": {
      "get": {
        "operationId": "listIdentityDocuments",
        "summary": "List identity documents",
        "tags": [
          "Onboarding"
        ],
        "parameters": [
          {
            "name": "customer_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "List identity documents",
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
      },
      "post": {
        "operationId": "createIdentityDocuments",
        "summary": "Create identity documents",
        "tags": [
          "Onboarding"
        ],
        "parameters": [
          {
            "name": "customer_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "responses": {
          "201": {
            "description": "Create identity documents",
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
    "/customers/{customer_id}/identity_documents/{document_id}": {
      "get": {
        "operationId": "readIdentityDocument",
        "summary": "Get identity document",
        "tags": [
          "Onboarding"
        ],
        "parameters": [
          {
            "name": "customer_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          },
          {
            "name": "document_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Get identity document",
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
      },
      "delete": {
        "operationId": "removeIdentityDocument",
        "summary": "Delete identity document",
        "tags": [
          "Onboarding"
        ],
        "parameters": [
          {
            "name": "customer_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          },
          {
            "name": "document_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "responses": {
          "204": {
            "description": "Deleted"
          },
          "default": {
            "description": "Unexpected error"
          }
        }
      }
    },
    "/customers/{customer_id}/identity_documents/{document_id}/front_image.jpg": {
      "get": {
        "operationId": "readFrontImage",
        "summary": "Get front image",
        "tags": [
          "Onboarding"
        ],
        "parameters": [
          {
            "name": "customer_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          },
          {
            "name": "document_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Get front image",
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
    "/customers/{customer_id}/oauth2_tokens": {
      "post": {
        "operationId": "createOauth2Token",
        "summary": "Create OAuth 2 token",
        "tags": [
          "Onboarding"
        ],
        "parameters": [
          {
            "name": "customer_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "responses": {
          "201": {
            "description": "Create OAuth 2 token",
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
    "/kyc_checks": {
      "get": {
        "operationId": "listKycChecks",
        "summary": "List KYC checks",
        "tags": [
          "Onboarding"
        ],
        "responses": {
          "200": {
            "description": "List KYC checks",
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
      },
      "post": {
        "operationId": "createKycChecks",
        "summary": "Create KYC checks",
        "tags": [
          "Onboarding"
        ],
        "responses": {
          "201": {
            "description": "Create KYC checks",
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
    "/kyc_checks/{check_id}/risk_assessments": {
      "get": {
        "operationId": "listRiskAssessments",
        "summary": "List risk assessments",
        "tags": [
          "Onboarding"
        ],
        "parameters": [
          {
            "name": "check_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "List risk assessments",
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
    "/documents/{document_id}.pdf": {
      "get": {
        "operationId": "readSignedDocument",
        "summary": "Get signed document",
        "tags": [
          "Onboarding"
        ],
        "parameters": [
          {
            "name": "document_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Get signed document",
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
    "/reports/v2.1/monthly_statements": {
      "get": {
        "operationId": "listMonthlyStatements",
        "summary": "List monthly statements",
        "tags": [
          "Onboarding"
        ],
        "responses": {
          "200": {
            "description": "List monthly statements",
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
    "/onboarding_sessions/{session_id}": {
      "get": {
        "operationId": "readOnboardingSession",
        "summary": "Get onboarding session",
        "tags": [
          "Onboarding"
        ],
        "parameters": [
          {
            "name": "session_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Get onboarding session",
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
    "/onboarding_sessions/{session_id}/address_verifications": {
      "post": {
        "operationId": "createAddressVerification",
        "summary": "Create address verification",
        "tags": [
          "Onboarding"
        ],
        "parameters": [
          {
            "name": "session_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "responses": {
          "201": {
            "description": "Create address verification",
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
    "/health": {
      "get": {
        "operationId": "readServiceHealth",
        "summary": "Get service health",
        "tags": [
          "Onboarding"
        ],
        "responses": {
          "200": {
            "description": "Get service health",
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
    "/{tenant_id}": {
      "get": {
        "operationId": "readTenant",
        "summary": "Get tenant",
        "tags": [
          "Onboarding"
        ],
        "parameters": [
          {
            "name": "tenant_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Get tenant",
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
          },
          "error": {
            "type": "object",
            "nullable": true
          }
        }
      }
    }
  }
};
