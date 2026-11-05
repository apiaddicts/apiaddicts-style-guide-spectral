module.exports = {
  "swagger": "2.0",
  "info": {
    "title": "Customer Onboarding API",
    "version": "1.4.0"
  },
  "host": "api.example.com",
  "basePath": "/customer-onboarding/v1",
  "schemes": [
    "https"
  ],
  "paths": {
    "/customers": {
      "get": {
        "operationId": "operation1",
        "summary": "Operation on /customers",
        "responses": {
          "200": {
            "description": "Operation on /customers",
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
    "/Customers": {
      "get": {
        "operationId": "operation2",
        "summary": "Operation on /Customers",
        "responses": {
          "200": {
            "description": "Operation on /Customers",
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
    "/identity-documents": {
      "get": {
        "operationId": "operation3",
        "summary": "Operation on /identity-documents",
        "responses": {
          "200": {
            "description": "Operation on /identity-documents",
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
    "/identity_documents": {
      "get": {
        "operationId": "operation4",
        "summary": "Operation on /identity_documents",
        "responses": {
          "200": {
            "description": "Operation on /identity_documents",
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
    "/identityDocuments": {
      "get": {
        "operationId": "operation5",
        "summary": "Operation on /identityDocuments",
        "responses": {
          "200": {
            "description": "Operation on /identityDocuments",
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
    "/IdentityDocuments": {
      "get": {
        "operationId": "operation6",
        "summary": "Operation on /IdentityDocuments",
        "responses": {
          "200": {
            "description": "Operation on /IdentityDocuments",
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
    "/customers/{customerId}/oauth2Tokens": {
      "get": {
        "operationId": "operation7",
        "summary": "Operation on /customers/{customerId}/oauth2Tokens",
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
            "description": "Operation on /customers/{customerId}/oauth2Tokens",
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
    "/customers/Orders": {
      "get": {
        "operationId": "operation8",
        "summary": "Operation on /customers/Orders",
        "responses": {
          "200": {
            "description": "Operation on /customers/Orders",
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
        "operationId": "operation9",
        "summary": "Operation on /documents/{documentId}.pdf",
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
            "description": "Operation on /documents/{documentId}.pdf",
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
    "/reports/v2.1/summary": {
      "get": {
        "operationId": "operation10",
        "summary": "Operation on /reports/v2.1/summary",
        "responses": {
          "200": {
            "description": "Operation on /reports/v2.1/summary",
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
        "operationId": "operation11",
        "summary": "Operation on /{tenantId}",
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
            "description": "Operation on /{tenantId}",
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
    "x-internalRoutes": {
      "owner": "onboarding-team"
    }
  },
  "definitions": {
    "Envelope": {
      "type": "object",
      "properties": {
        "data": {
          "type": "object"
        }
      }
    }
  }
};
