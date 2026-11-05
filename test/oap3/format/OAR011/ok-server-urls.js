module.exports = {
  "openapi": "3.0.3",
  "info": {
    "title": "Customer Onboarding API",
    "version": "1.0.0"
  },
  "servers": [
    {
      "url": "https://api.example.com"
    },
    {
      "url": "https://api.example.com/"
    },
    {
      "url": "http://localhost:8080/onboarding/v1"
    },
    {
      "url": "{scheme}://{host}:{port}/{basePath}"
    },
    {
      "url": "//api.example.com/onboarding/v1"
    },
    {
      "url": "/onboarding/v1"
    },
    {
      "url": "onboarding/v1"
    },
    {
      "url": "./v1"
    },
    {
      "url": "../onboarding/v1"
    },
    {
      "url": "https://api.example.com/onboarding/v1?tenant=Retail_EU#Section-A"
    },
    {
      "url": "https://API.Example.COM/onboarding/v1"
    },
    {
      "url": "https://svc_User:Secret@api.example.com/onboarding/v1"
    },
    {
      "url": "{baseUrl}"
    },
    {
      "url": "https://{Region}.example.com/onboarding/{Version}"
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
