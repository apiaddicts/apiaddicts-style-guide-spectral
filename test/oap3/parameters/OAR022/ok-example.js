module.exports = {
  "openapi": "3.0.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore"
  },
  "paths": {
    "/invoices": {
      "get": {
        "parameters": [
          {
            "name": "$orderby",
            "in": "query",
            "schema": { "type": "string" }
          }
        ],
        "responses": {
          "206": {
            "description": "ok"
          }
        }
      }
    },
    "/reports": {
      "get": {
        "responses": {
          "200": {
            "description": "no pagination ok"
          }
        }
      }
    }
  }
};