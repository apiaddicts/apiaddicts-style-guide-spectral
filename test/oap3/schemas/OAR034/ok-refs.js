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
                  "$ref": "#/components/schemas/PolicyPage"
                }
              }
            }
          },
          "206": {
            "description": "Ok",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/PolicyPageAlias"
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
    "/categories": {
      "get": {
        "responses": {
          "200": {
            "$ref": "#/components/responses/CategoryPageResponse"
          }
        }
      }
    },
    "/notes": {
      "get": {
        "responses": {
          "200": {
            "description": "Ok",
            "content": {
              "application/json": {
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
                          "$ref": "#/components/schemas/PagingCore"
                        },
                        {
                          "type": "object",
                          "required": [
                            "links"
                          ],
                          "properties": {
                            "links": {
                              "$ref": "#/components/schemas/PagingLinks"
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
        }
      }
    },
    "/brokers": {
      "get": {
        "responses": {
          "200": {
            "description": "Ok",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "nullable": true,
                  "properties": {
                    "data": {
                      "type": "array",
                      "nullable": true,
                      "items": {
                        "type": "string"
                      }
                    },
                    "paging": {
                      "allOf": [
                        {
                          "$ref": "#/components/schemas/Paging"
                        }
                      ],
                      "nullable": true
                    }
                  }
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
      "CategoryPageResponse": {
        "description": "Categories",
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/CategoryPage"
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
            "$ref": "#/components/schemas/Link"
          },
          "first": {
            "$ref": "#/components/schemas/Link"
          },
          "previous": {
            "$ref": "#/components/schemas/Link"
          },
          "next": {
            "$ref": "#/components/schemas/Link"
          },
          "last": {
            "$ref": "#/components/schemas/Link"
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
            "$ref": "#/components/schemas/PagingLinks"
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
            "$ref": "#/components/schemas/Paging"
          }
        }
      },
      "PolicyPage": {
        "type": "object",
        "properties": {
          "data": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/Policy"
            }
          },
          "paging": {
            "$ref": "#/components/schemas/Paging"
          }
        }
      },
      "PolicyPageAlias": {
        "$ref": "#/components/schemas/PolicyPage"
      },
      "ClaimPage": {
        "allOf": [
          {
            "$ref": "#/components/schemas/PagingEnvelope"
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
              "$ref": "#/components/schemas/Category"
            }
          },
          "paging": {
            "$ref": "#/components/schemas/Paging"
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
              "$ref": "#/components/schemas/Category"
            }
          },
          "parent": {
            "$ref": "#/components/schemas/Category"
          }
        }
      },
      "Policy": {
        "type": "object",
        "properties": {
          "policyId": {
            "type": "string"
          },
          "items": {
            "type": "array",
            "items": {
              "type": "string"
            }
          }
        }
      }
    }
  }
};
