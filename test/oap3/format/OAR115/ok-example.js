module.exports = {
  "openapi": "3.0.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore"
  },
  "paths": {},
  "components": {
    "schemas": {
      "ValidRequired": {
        "type": "object",
        "properties": {
          "id": { "type": "integer" },
          "name": { "type": "string" }
        },
        "required": [
          "id",
          "name"
        ]
      },
      "NoRequired": {
        "type": "object",
        "properties": {
          "value": { "type": "string" }
        }
      },
      "EmptyRequired": {
        "type": "object",
        "properties": {
          "field": { "type": "string" }
        },
        "required": []
      },
      "NestedAllValid": {
        "type": "object",
        "properties": {
          "outer": {
            "type": "object",
            "properties": {
              "inner": {
                "type": "object",
                "properties": {
                  "id": { "type": "integer" }
                },
                "required": [
                  "id"
                ]
              }
            },
            "required": []
          }
        }
      },
      "NonObjectSchemaIgnored": {
        "type": "array",
        "items": {
          "type": "string"
        },
        "required": [
          "ignored"
        ]
      }
    }
  }
};