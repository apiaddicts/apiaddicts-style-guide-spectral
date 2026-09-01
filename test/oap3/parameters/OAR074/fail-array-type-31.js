module.exports = {
  "openapi": "3.1.1",
  "info": {
    "version": "1.0.0",
    "title": "My API"
  },
  "paths": {
    "/items": {
      "get": {
        "summary": "Get a list of items",
        "parameters": [
          {
            "name": "minOnly",
            "in": "query",
            "schema": { "type": ["integer", "null"], "minimum": 0 }
          },
          {
            "name": "noRestriction",
            "in": "query",
            "schema": { "type": ["number", "null"] }
          },
          {
            "name": "minMax",
            "in": "query",
            "schema": { "type": ["integer", "null"], "minimum": 0, "maximum": 100 }
          },
          {
            "name": "formatOnly",
            "in": "query",
            "schema": { "type": ["integer", "null"], "format": "int32" }
          },
          {
            "name": "plainStr",
            "in": "query",
            "schema": { "type": ["string", "null"] }
          }
        ],
        "responses": {
          "200": { "description": "A list of items" }
        }
      }
    }
  }
};
