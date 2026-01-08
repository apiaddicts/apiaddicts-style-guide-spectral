module.exports = {
  "swagger": "2.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore"
  },
  "paths": {},
  "definitions": {
    "NoRequired": {
      "type": "object",
      "properties": {
        "id": { "type": "integer" }
      }
    },
    "RequiredMatchesProperties": {
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
    "EmptyRequiredArray": {
      "type": "object",
      "properties": {
        "field": { "type": "string" }
      }
    },
    "NestedObjectsAllValid": {
      "type": "object",
      "properties": {
        "parent": {
          "type": "object",
          "properties": {
            "childId": { "type": "integer" }
          },
          "required": [
            "childId"
          ]
        }
      }
    },
    "NonObjectSchemaIgnored": {
      "type": "string",
      "required": [
        "ignored"
      ]
    }
  }
};