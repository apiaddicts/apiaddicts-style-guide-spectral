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
              "$ref": "#/definitions/PolicyPage"
            }
          },
          "206": {
            "description": "Ok",
            "schema": {
              "$ref": "#/definitions/PolicyPageAlias"
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
    },
    "/categories": {
      "get": {
        "responses": {
          "200": {
            "$ref": "#/responses/CategoryPageResponse"
          }
        }
      }
    },
    "/notes": {
      "get": {
        "responses": {
          "200": {
            "description": "Ok",
            "schema": {
              "type": "object",
              "properties": {
                "data": {
                  "type": "array",
                  "items": {
                    "type": "string"
                  }
                },
                "paging": {
                  "allOf": [
                    {
                      "$ref": "#/definitions/PagingCore"
                    },
                    {
                      "type": "object",
                      "required": [
                        "links"
                      ],
                      "properties": {
                        "links": {
                          "$ref": "#/definitions/PagingLinks"
                        }
                      }
                    }
                  ]
                }
              }
            }
          }
        }
      }
    },
    "/brokers": {
      "get": {
        "responses": {
          "200": {
            "description": "Ok",
            "schema": {
              "type": "object",
              "x-nullable": true,
              "properties": {
                "data": {
                  "type": "array",
                  "x-nullable": true,
                  "items": {
                    "type": "string"
                  }
                },
                "paging": {
                  "allOf": [
                    {
                      "$ref": "#/definitions/Paging"
                    }
                  ],
                  "x-nullable": true
                }
              }
            }
          }
        }
      }
    }
  },
  "responses": {
    "CategoryPageResponse": {
      "description": "Categories",
      "schema": {
        "$ref": "#/definitions/CategoryPage"
      }
    }
  },
  "definitions": {
    "Link": {
      "type": "object",
      "properties": {
        "href": {
          "type": "string",
          "format": "uri"
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
        "first": {
          "$ref": "#/definitions/Link"
        },
        "previous": {
          "$ref": "#/definitions/Link"
        },
        "next": {
          "$ref": "#/definitions/Link"
        },
        "last": {
          "$ref": "#/definitions/Link"
        }
      }
    },
    "Paging": {
      "type": "object",
      "required": [
        "start",
        "limit",
        "links"
      ],
      "properties": {
        "start": {
          "type": "integer"
        },
        "limit": {
          "type": "integer"
        },
        "total": {
          "type": "integer",
          "format": "int64"
        },
        "numPages": {
          "type": "integer"
        },
        "links": {
          "$ref": "#/definitions/PagingLinks"
        }
      }
    },
    "PagingCore": {
      "type": "object",
      "required": [
        "start",
        "limit"
      ],
      "properties": {
        "start": {
          "type": "integer"
        },
        "limit": {
          "type": "integer"
        }
      }
    },
    "PagingEnvelope": {
      "type": "object",
      "properties": {
        "paging": {
          "$ref": "#/definitions/Paging"
        }
      }
    },
    "PolicyPage": {
      "type": "object",
      "properties": {
        "data": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "paging": {
          "$ref": "#/definitions/Paging"
        }
      }
    },
    "PolicyPageAlias": {
      "$ref": "#/definitions/PolicyPage"
    },
    "ClaimPage": {
      "allOf": [
        {
          "$ref": "#/definitions/PagingEnvelope"
        },
        {
          "type": "object",
          "properties": {
            "items": {
              "type": "array",
              "items": {
                "type": "string"
              }
            }
          }
        }
      ]
    },
    "CategoryPage": {
      "type": "object",
      "properties": {
        "results": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/Category"
          }
        },
        "paging": {
          "$ref": "#/definitions/Paging"
        }
      }
    },
    "Category": {
      "type": "object",
      "properties": {
        "code": {
          "type": "string"
        },
        "children": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/Category"
          }
        }
      }
    }
  }
};
