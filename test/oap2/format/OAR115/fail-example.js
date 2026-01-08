module.exports = {
  "swagger": "2.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore"
  },
  "paths": {},
  "definitions": {
    "SimpleInvalid": {
      "type": "object",
      "properties": {
        "id": { "type": "integer" }
      },
      "required": [
        "id",
        "missingField"
      ]
    },
    "MultipleInvalidRequired": {
      "type": "object",
      "properties": {
        "code": { "type": "integer" }
      },
      "required": [
        "code",
        "message",
        "detail"
      ]
    },
    "EmptyProperties": {
      "type": "object",
      "properties": {},
      "required": [
        "anyField"
      ]
    },
    "NoPropertiesNode": {
      "type": "object",
      "required": [
        "ghost"
      ]
    },
    "MixedValidAndInvalid": {
      "type": "object",
      "properties": {
        "valid": { "type": "string" }
      },
      "required": [
        "valid",
        "invalid1",
        "invalid2"
      ]
    }
  }
};