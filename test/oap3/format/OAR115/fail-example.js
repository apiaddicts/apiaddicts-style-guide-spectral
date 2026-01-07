module.exports = {
  "openapi": "3.0.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore"
  },
  "paths": {},
  "components": {
    "schemas": {
      "SimpleInvalid": {
        "type": "object",
        "properties": {
          "id": { "type": "integer" }
        },
        "required": [
          "id",
          "missing"
        ]
      },
      "MultipleInvalid": {
        "type": "object",
        "properties": {
          "code": { "type": "integer" }
        },
        "required": [
          "code",
          "message",
          "extra"
        ]
      },
      "OnlyRequiredNoProperties": {
        "type": "object",
        "required": [
          "ghost"
        ]
      },
      "EmptyProperties": {
        "type": "object",
        "properties": {},
        "required": [
          "nothing"
        ]
      },
      "MixedValidInvalid": {
        "type": "object",
        "properties": {
          "valid": { "type": "string" }
        },
        "required": [
          "valid",
          "invalidA",
          "invalidB"
        ]
      }
    }
  }
};