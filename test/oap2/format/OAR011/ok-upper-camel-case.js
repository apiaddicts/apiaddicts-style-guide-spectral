module.exports = {
  "swagger": "2.0",
  "info": {
    "title": "Customer Onboarding API",
    "version": "1.0.0",
    "description": "Paths written in UpperCamelCase."
  },
  "host": "api.heytrade.com",
  "basePath": "/Onboarding/V1",
  "schemes": [
    "https"
  ],
  "produces": [
    "application/json"
  ],
  "paths": {
    "/Customers": {
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
    "/Customers/{CustomerId}": {
      "get": {
        "operationId": "readCustomer",
        "summary": "Get customer",
        "tags": [
          "Onboarding"
        ],
        "parameters": [
          {
            "name": "CustomerId",
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
            "name": "CustomerId",
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
    "/Customers/{CustomerId}/IdentityDocuments": {
      "get": {
        "operationId": "listIdentityDocuments",
        "summary": "List identity documents",
        "tags": [
          "Onboarding"
        ],
        "parameters": [
          {
            "name": "CustomerId",
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
            "name": "CustomerId",
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
    "/Customers/{CustomerId}/IdentityDocuments/{DocumentId}": {
      "get": {
        "operationId": "readIdentityDocument",
        "summary": "Get identity document",
        "tags": [
          "Onboarding"
        ],
        "parameters": [
          {
            "name": "CustomerId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "DocumentId",
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
            "name": "CustomerId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "DocumentId",
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
    "/Customers/{CustomerId}/IdentityDocuments/{DocumentId}/FrontImage.jpg": {
      "get": {
        "operationId": "readFrontImage",
        "summary": "Get front image",
        "tags": [
          "Onboarding"
        ],
        "parameters": [
          {
            "name": "CustomerId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "DocumentId",
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
    "/Customers/{CustomerId}/Oauth2Tokens": {
      "post": {
        "operationId": "createOauth2Token",
        "summary": "Create OAuth 2 token",
        "tags": [
          "Onboarding"
        ],
        "parameters": [
          {
            "name": "CustomerId",
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
    "/KycChecks": {
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
    "/KycChecks/{CheckId}/RiskAssessments": {
      "get": {
        "operationId": "listRiskAssessments",
        "summary": "List risk assessments",
        "tags": [
          "Onboarding"
        ],
        "parameters": [
          {
            "name": "CheckId",
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
    "/Documents/{DocumentId}.pdf": {
      "get": {
        "operationId": "readSignedDocument",
        "summary": "Get signed document",
        "tags": [
          "Onboarding"
        ],
        "parameters": [
          {
            "name": "DocumentId",
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
    "/Reports/V2.1/MonthlyStatements": {
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
    "/OnboardingSessions/{SessionId}": {
      "get": {
        "operationId": "readOnboardingSession",
        "summary": "Get onboarding session",
        "tags": [
          "Onboarding"
        ],
        "parameters": [
          {
            "name": "SessionId",
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
    "/OnboardingSessions/{SessionId}/AddressVerifications": {
      "post": {
        "operationId": "createAddressVerification",
        "summary": "Create address verification",
        "tags": [
          "Onboarding"
        ],
        "parameters": [
          {
            "name": "SessionId",
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
    "/Health": {
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
    "/{TenantId}": {
      "get": {
        "operationId": "readTenant",
        "summary": "Get tenant",
        "tags": [
          "Onboarding"
        ],
        "parameters": [
          {
            "name": "TenantId",
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
