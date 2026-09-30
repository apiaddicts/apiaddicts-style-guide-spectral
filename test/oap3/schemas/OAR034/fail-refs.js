module.exports = {
  "openapi": "3.0.3",
  "info": {
    "title": "Insurance Policy API",
    "version": "1.0.0"
  },
  "paths": {
    "/policies": {
      "get": {
        "responses": {
          "200": {
            "description": "Ok",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/PolicyCollection"
                }
              }
            }
          }
        }
      }
    },
    "/regions": {
      "get": {
        "responses": {
          "206": {
            "$ref": "#/components/responses/RegionPageResponse"
          }
        }
      }
    },
    "/payments": {
      "get": {
        "responses": {
          "200": {
            "description": "Ok",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/PaymentPage"
                }
              }
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
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ClaimPage"
                }
              }
            }
          }
        }
      }
    },
    "/claims-again": {
      "get": {
        "responses": {
          "200": {
            "description": "Ok",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ClaimPage"
                }
              }
            }
          }
        }
      }
    }
  },
  "components": {
    "responses": {
      "RegionPageResponse": {
        "description": "Partial list",
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/RegionPageAlias"
            }
          }
        }
      }
    },
    "schemas": {
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
            "$ref": "#/components/schemas/Link"
          },
          "previous": {
            "$ref": "#/components/schemas/Link"
          },
          "next": {
            "$ref": "#/components/schemas/Link"
          }
        }
      },
      "PolicyCollection": {
        "type": "object",
        "properties": {
          "data": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/Policy"
            }
          }
        }
      },
      "RegionPageAlias": {
        "$ref": "#/components/schemas/RegionPage"
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
                "$ref": "#/components/schemas/PagingLinks"
              }
            }
          }
        }
      },
      "PaymentPage": {
        "allOf": [
          {
            "$ref": "#/components/schemas/LegacyEnvelope"
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
            "$ref": "#/components/schemas/PagingLinks"
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
            "$ref": "#/components/schemas/PagingWithoutStart"
          }
        }
      },
      "Policy": {
        "type": "object",
        "properties": {
          "policyId": {
            "type": "string"
          }
        }
      }
    }
  }
};
