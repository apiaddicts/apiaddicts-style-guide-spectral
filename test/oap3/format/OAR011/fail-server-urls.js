module.exports = {
  "openapi": "3.0.3",
  "info": {
    "title": "Customer Onboarding API",
    "version": "1.0.0"
  },
  "servers": [
    {
      "url": "https://api.example.com/onboardingApi/v1"
    },
    {
      "url": "{scheme}://api.example.com/Onboarding/v1"
    },
    {
      "url": "//api.example.com/onboarding_api/v1"
    },
    {
      "url": "/Onboarding/V1"
    },
    {
      "url": "onboardingApi/v1"
    },
    {
      "url": "https://api.example.com/onboarding/v1/Customers?tenant=x"
    },
    {
      "url": "https://api.example.com:8443/{basePath}/Internal"
    },
    {
      "url": "http://localhost:8080/onboarding/V1/"
    }
  ],
  "paths": {
    "/{customerId}": {
      "get": {
        "operationId": "getCustomer",
        "summary": "Get customer",
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
      }
    }
  },
  "components": {
    "schemas": {
      "Envelope": {
        "type": "object"
      }
    }
  }
};
