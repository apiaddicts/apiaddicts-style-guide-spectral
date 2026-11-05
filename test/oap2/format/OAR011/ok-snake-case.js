module.exports = {
  "swagger": "2.0",
  "info": {
    "title": "Customer Onboarding API",
    "version": "1.0.0",
    "description": "Paths written in snake_case."
  },
  "host": "api.heytrade.com",
  "basePath": "/onboarding/v1",
  "schemes": [
    "https"
  ],
  "produces": [
    "application/json"
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
            "schema": {
              "$ref": "#/definitions/Envelope"
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
            "schema": {
              "$ref": "#/definitions/Envelope"
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
            "type": "string"
          }
        ],
        "responses": {
          "200": {
            "description": "Get customer",
            "schema": {
              "$ref": "#/definitions/Envelope"
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
            "type": "string"
          }
        ],
        "responses": {
          "200": {
            "description": "Update customer",
            "schema": {
              "$ref": "#/definitions/Envelope"
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
            "type": "string"
          }
        ],
        "responses": {
          "200": {
            "description": "List identity documents",
            "schema": {
              "$ref": "#/definitions/Envelope"
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
            "type": "string"
          }
        ],
        "responses": {
          "201": {
            "description": "Create identity documents",
            "schema": {
              "$ref": "#/definitions/Envelope"
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
            "type": "string"
          },
          {
            "name": "document_id",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responses": {
          "200": {
            "description": "Get identity document",
            "schema": {
              "$ref": "#/definitions/Envelope"
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
            "type": "string"
          },
          {
            "name": "document_id",
            "in": "path",
            "required": true,
            "type": "string"
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
            "type": "string"
          },
          {
            "name": "document_id",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responses": {
          "200": {
            "description": "Get front image",
            "schema": {
              "$ref": "#/definitions/Envelope"
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
            "type": "string"
          }
        ],
        "responses": {
          "201": {
            "description": "Create OAuth 2 token",
            "schema": {
              "$ref": "#/definitions/Envelope"
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
            "schema": {
              "$ref": "#/definitions/Envelope"
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
            "schema": {
              "$ref": "#/definitions/Envelope"
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
            "type": "string"
          }
        ],
        "responses": {
          "200": {
            "description": "List risk assessments",
            "schema": {
              "$ref": "#/definitions/Envelope"
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
            "type": "string"
          }
        ],
        "responses": {
          "200": {
            "description": "Get signed document",
            "schema": {
              "$ref": "#/definitions/Envelope"
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
            "schema": {
              "$ref": "#/definitions/Envelope"
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
            "type": "string"
          }
        ],
        "responses": {
          "200": {
            "description": "Get onboarding session",
            "schema": {
              "$ref": "#/definitions/Envelope"
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
            "type": "string"
          }
        ],
        "responses": {
          "201": {
            "description": "Create address verification",
            "schema": {
              "$ref": "#/definitions/Envelope"
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
            "schema": {
              "$ref": "#/definitions/Envelope"
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
            "type": "string"
          }
        ],
        "responses": {
          "200": {
            "description": "Get tenant",
            "schema": {
              "$ref": "#/definitions/Envelope"
            }
          },
          "default": {
            "description": "Unexpected error"
          }
        }
      }
    }
  },
  "definitions": {
    "Envelope": {
      "type": "object",
      "properties": {
        "data": {
          "type": "object"
        },
        "error": {
          "type": "object"
        }
      }
    }
  }
};
