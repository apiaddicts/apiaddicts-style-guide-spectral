module.exports = {
  "swagger": "2.0",
  "info": {
    "title": "Tenant Directory API",
    "version": "2.0.0"
  },
  "host": "API.Example.COM",
  "basePath": "/",
  "schemes": [
    "https"
  ],
  "paths": {
    "/{tenantId}": {
      "get": {
        "operationId": "getTenant",
        "summary": "Get tenant",
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
    },
    "/{tenantId}/{userId}": {
      "get": {
        "operationId": "getTenantUser",
        "summary": "Get tenant user",
        "parameters": [
          {
            "name": "tenantId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "userId",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responses": {
          "200": {
            "description": "Get tenant user",
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
      "owner": "Directory_Team"
    },
    "x-Amazon-Gateway": {
      "enabled": true
    }
  },
  "x-servers": [
    {
      "url": "https://api.example.com/Tenant_Directory/V2"
    }
  ],
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
