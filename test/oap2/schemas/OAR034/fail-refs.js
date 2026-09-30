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
    "/policies": {
      "get": {
        "responses": {
          "200": {
            "description": "Ok",
            "schema": {
              "$ref": "#/definitions/PolicyCollection"
            }
          }
        }
      }
    },
    "/regions": {
      "get": {
        "responses": {
          "206": {
            "$ref": "#/responses/RegionPageResponse"
          }
        }
      }
    },
    "/payments": {
      "get": {
        "responses": {
          "200": {
            "description": "Ok",
            "schema": {
              "$ref": "#/definitions/PaymentPage"
            }
          }
        }
      }
    },
    "/claims": {
      "get": {
        "responses": {
          "200": {
            "description": "Ok",
            "schema": {
              "$ref": "#/definitions/ClaimPage"
            }
          }
        }
      }
    }
  },
  "responses": {
    "RegionPageResponse": {
      "description": "Partial list",
      "schema": {
        "$ref": "#/definitions/RegionPageAlias"
      }
    }
  },
  "definitions": {
    "Link": {
      "type": "object",
      "properties": {
        "href": {
          "type": "string"
        }
      }
    },
    "PagingLinks": {
      "type": "object",
      "required": [
        "self",
        "previous",
        "next"
      ],
      "properties": {
        "self": {
          "$ref": "#/definitions/Link"
        },
        "previous": {
          "$ref": "#/definitions/Link"
        },
        "next": {
          "$ref": "#/definitions/Link"
        }
      }
    },
    "PolicyCollection": {
      "type": "object",
      "properties": {
        "data": {
          "type": "array",
          "items": {
            "type": "string"
          }
        }
      }
    },
    "RegionPageAlias": {
      "$ref": "#/definitions/RegionPage"
    },
    "RegionPage": {
      "type": "object",
      "properties": {
        "data": {
          "type": "array",
          "items": {
            "type": "string"
          }
        }
      }
    },
    "LegacyEnvelope": {
      "type": "object",
      "properties": {
        "paging": {
          "type": "object",
          "required": [
            "start",
            "links"
          ],
          "properties": {
            "start": {
              "type": "integer"
            },
            "limit": {
              "type": "integer"
            },
            "links": {
              "$ref": "#/definitions/PagingLinks"
            }
          }
        }
      }
    },
    "PaymentPage": {
      "allOf": [
        {
          "$ref": "#/definitions/LegacyEnvelope"
        },
        {
          "type": "object",
          "properties": {
            "data": {
              "type": "array",
              "items": {
                "type": "string"
              }
            }
          }
        }
      ]
    },
    "PagingWithoutStart": {
      "type": "object",
      "required": [
        "limit",
        "links"
      ],
      "properties": {
        "limit": {
          "type": "integer"
        },
        "links": {
          "$ref": "#/definitions/PagingLinks"
        }
      }
    },
    "ClaimPage": {
      "type": "object",
      "properties": {
        "items": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "paging": {
          "$ref": "#/definitions/PagingWithoutStart"
        }
      }
    }
  }
};
