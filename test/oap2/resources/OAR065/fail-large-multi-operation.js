module.exports = {
  "swagger": "2.0",
  "info": { "version": "1.0.0", "title": "Swagger Petstore" },
  "paths": {
    "/pets/{id}": {
      "delete": {
        "parameters": [{ "in": "path", "name": "id", "required": true, "type": "string" }],
        "responses": {
          "200": { "description": "OK" },
          "404": { "description": "Not found" }
        }
      }
    },
    "/orders/{id}": {
      "delete": {
        "parameters": [{ "in": "path", "name": "id", "required": true, "type": "string" }],
        "responses": {
          "202": { "description": "Accepted" },
          "204": { "description": "No content" }
        }
      }
    },
    "/invoices/{id}": {
      "delete": {
        "parameters": [{ "in": "path", "name": "id", "required": true, "type": "string" }],
        "responses": {
          "500": { "description": "Server error" }
        }
      }
    },
    "/shipments/{id}": {
      "delete": {
        "parameters": [{ "in": "path", "name": "id", "required": true, "type": "string" }],
        "responses": {
          "400": { "description": "Bad request" },
          "409": { "description": "Conflict" }
        }
      }
    },
    "/payments/{id}": {
      "delete": {
        "parameters": [{ "in": "path", "name": "id", "required": true, "type": "string" }],
        "responses": {
          "204": { "description": "No content" }
        }
      }
    },
    "/refunds/{id}": {
      "delete": {
        "parameters": [{ "in": "path", "name": "id", "required": true, "type": "string" }],
        "responses": {
          "404": { "description": "Not found" }
        }
      }
    },
    "/status": {
      "delete": {
        "responses": {
          "500": { "description": "Server error" }
        }
      }
    },
    "/reports/{id}": {
      "delete": {
        "parameters": [{ "in": "path", "name": "id", "required": true, "type": "string" }],
        "responses": {
          "202": { "description": "Accepted" }
        }
      }
    }
  }
};
