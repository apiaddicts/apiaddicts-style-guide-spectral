module.exports = {
  "swagger": "2.0",
  "info": {
    "title": "Customer Onboarding API",
    "version": "1.0.0",
    "description": "Paths written in kebab-case."
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
    "/customers/{customerId}": {
      "get": {
        "operationId": "readCustomer",
        "summary": "Get customer",
        "tags": [
          "Onboarding"
        ],
        "parameters": [
          {
            "name": "customerId",
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
            "name": "customerId",
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
    "/customers/{customerId}/identity-documents": {
      "get": {
        "operationId": "listIdentityDocuments",
        "summary": "List identity documents",
        "tags": [
          "Onboarding"
        ],
        "parameters": [
          {
            "name": "customerId",
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
            "name": "customerId",
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
    "/customers/{customerId}/identity-documents/{documentId}": {
      "get": {
        "operationId": "readIdentityDocument",
        "summary": "Get identity document",
        "tags": [
          "Onboarding"
        ],
        "parameters": [
          {
            "name": "customerId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "documentId",
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
            "name": "customerId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "documentId",
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
    "/customers/{customerId}/identity-documents/{documentId}/front-image.jpg": {
      "get": {
        "operationId": "readFrontImage",
        "summary": "Get front image",
        "tags": [
          "Onboarding"
        ],
        "parameters": [
          {
            "name": "customerId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "documentId",
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
    "/customers/{customerId}/oauth2-tokens": {
      "post": {
        "operationId": "createOauth2Token",
        "summary": "Create OAuth 2 token",
        "tags": [
          "Onboarding"
        ],
        "parameters": [
          {
            "name": "customerId",
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
    "/kyc-checks": {
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
    "/kyc-checks/{checkId}/risk-assessments": {
      "get": {
        "operationId": "listRiskAssessments",
        "summary": "List risk assessments",
        "tags": [
          "Onboarding"
        ],
        "parameters": [
          {
            "name": "checkId",
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
    "/documents/{documentId}.pdf": {
      "get": {
        "operationId": "readSignedDocument",
        "summary": "Get signed document",
        "tags": [
          "Onboarding"
        ],
        "parameters": [
          {
            "name": "documentId",
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
    "/reports/v2.1/monthly-statements": {
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
    "/onboarding-sessions/{sessionId}": {
      "get": {
        "operationId": "readOnboardingSession",
        "summary": "Get onboarding session",
        "tags": [
          "Onboarding"
        ],
        "parameters": [
          {
            "name": "sessionId",
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
    "/onboarding-sessions/{sessionId}/address-verifications": {
      "post": {
        "operationId": "createAddressVerification",
        "summary": "Create address verification",
        "tags": [
          "Onboarding"
        ],
        "parameters": [
          {
            "name": "sessionId",
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
    "/{tenantId}": {
      "get": {
        "operationId": "readTenant",
        "summary": "Get tenant",
        "tags": [
          "Onboarding"
        ],
        "parameters": [
          {
            "name": "tenantId",
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
