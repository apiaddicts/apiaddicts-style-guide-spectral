module.exports = {
  "swagger": "2.0",
  "info": {
    "title": "Insurance Policy API",
    "version": "1.0.0"
  },
  "produces": [
    "application/json"
  ],
  "paths": {
    "/emails/{emailStore}/last": {
      "get": {
        "responses": {
          "200": {
            "description": "Ok",
            "schema": {
              "$ref": "#/definitions/EmailReaderResponse"
            }
          },
          "400": {
            "description": "Ok",
            "schema": {
              "$ref": "#/definitions/Problem"
            }
          }
        }
      }
    },
    "/emails/{emailStore}/last-content": {
      "get": {
        "responses": {
          "200": {
            "description": "Ok",
            "schema": {
              "$ref": "#/definitions/EmailReaderResponse"
            }
          },
          "default": {
            "description": "Ok",
            "schema": {
              "$ref": "#/definitions/Problem"
            }
          }
        }
      }
    }
  },
  "definitions": {
    "EmailReaderResponse": {
      "type": "object",
      "properties": {
        "attachments": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/EmailReaderAttachmentDto"
          }
        },
        "body": {
          "type": "string"
        },
        "cc": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "from": {
          "type": "string"
        },
        "messageId": {
          "type": "string"
        },
        "subject": {
          "type": "string"
        },
        "to": {
          "type": "array",
          "items": {
            "type": "string"
          }
        }
      }
    },
    "EmailReaderAttachmentDto": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string"
        },
        "size": {
          "type": "integer"
        }
      }
    },
    "Problem": {
      "type": "object",
      "properties": {
        "title": {
          "type": "string"
        },
        "errors": {
          "type": "array",
          "items": {
            "type": "string"
          }
        }
      }
    }
  }
};
