module.exports = {
  "swagger": "2.0",
  "info": {
    "title": "Identity Directory API",
    "description": "Every response wraps its payload in a result object that carries the pagination of collections.",
    "version": "4.1.0"
  },
  "host": "api.example.com",
  "basePath": "/identity/v4",
  "produces": [
    "application/json"
  ],
  "paths": {
    "/users": {
      "get": {
        "summary": "List users",
        "responses": {
          "200": {
            "description": "Ok",
            "schema": {
              "$ref": "#/definitions/UserPage"
            }
          },
          "400": {
            "$ref": "#/responses/Problem"
          }
        }
      },
      "post": {
        "summary": "Bulk create users",
        "responses": {
          "200": {
            "description": "Ok",
            "schema": {
              "type": "object",
              "properties": {
                "data": {
                  "type": "array",
                  "items": {
                    "$ref": "#/definitions/User"
                  }
                }
              }
            }
          }
        }
      }
    },
    "/users/me": {
      "get": {
        "summary": "Get the signed in user",
        "responses": {
          "200": {
            "description": "Ok",
            "schema": {
              "type": "object",
              "properties": {
                "result": {
                  "type": "object",
                  "properties": {
                    "data": {
                      "$ref": "#/definitions/User"
                    }
                  }
                }
              }
            }
          },
          "400": {
            "$ref": "#/responses/Problem"
          }
        }
      }
    },
    "/users/{userId}": {
      "get": {
        "summary": "Get user",
        "parameters": [
          {
            "name": "userId",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responses": {
          "200": {
            "description": "Ok",
            "schema": {
              "type": "object",
              "properties": {
                "result": {
                  "type": "object",
                  "properties": {
                    "data": {
                      "$ref": "#/definitions/User"
                    }
                  }
                }
              }
            }
          },
          "400": {
            "$ref": "#/responses/Problem"
          }
        }
      }
    },
    "/users/{userId}/sessions": {
      "get": {
        "summary": "List the sessions of a user",
        "parameters": [
          {
            "name": "userId",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responses": {
          "200": {
            "description": "Ok",
            "schema": {
              "type": "object",
              "properties": {
                "result": {
                  "type": "object",
                  "required": [
                    "pagination"
                  ],
                  "properties": {
                    "data": {
                      "type": "array",
                      "items": {
                        "type": "string"
                      }
                    },
                    "pagination": {
                      "$ref": "#/definitions/Pagination"
                    }
                  }
                }
              }
            }
          },
          "400": {
            "$ref": "#/responses/Problem"
          }
        }
      }
    },
    "/groups": {
      "get": {
        "summary": "List groups",
        "responses": {
          "200": {
            "description": "Ok",
            "schema": {
              "type": "object",
              "properties": {
                "result": {
                  "type": "object",
                  "required": [
                    "pagination"
                  ],
                  "properties": {
                    "items": {
                      "type": "array",
                      "items": {
                        "$ref": "#/definitions/Group"
                      }
                    },
                    "pagination": {
                      "$ref": "#/definitions/Pagination"
                    }
                  }
                }
              }
            }
          },
          "400": {
            "$ref": "#/responses/Problem"
          }
        }
      }
    },
    "/roles": {
      "get": {
        "summary": "List roles",
        "responses": {
          "200": {
            "description": "Ok",
            "schema": {
              "type": "object",
              "properties": {
                "result": {
                  "type": "object",
                  "required": [
                    "pagination"
                  ],
                  "properties": {
                    "data": {
                      "type": "array",
                      "items": {
                        "$ref": "#/definitions/Role"
                      }
                    },
                    "pagination": {
                      "$ref": "#/definitions/Pagination"
                    }
                  }
                }
              }
            }
          },
          "400": {
            "$ref": "#/responses/Problem"
          }
        }
      }
    },
    "/devices": {
      "get": {
        "summary": "List devices",
        "responses": {
          "200": {
            "description": "Ok",
            "schema": {
              "type": "object",
              "properties": {
                "result": {
                  "type": "object",
                  "required": [
                    "pagination"
                  ],
                  "properties": {
                    "data": {
                      "type": "array",
                      "items": {
                        "type": "string"
                      }
                    },
                    "pagination": {
                      "$ref": "#/definitions/Pagination"
                    }
                  }
                }
              }
            }
          },
          "400": {
            "$ref": "#/responses/Problem"
          }
        }
      }
    },
    "/audit-events": {
      "get": {
        "summary": "List audit events",
        "responses": {
          "200": {
            "description": "Ok",
            "schema": {
              "type": "object",
              "properties": {
                "result": {
                  "type": "object",
                  "required": [
                    "pagination"
                  ],
                  "properties": {
                    "data": {
                      "type": "array",
                      "items": {
                        "type": "string"
                      }
                    },
                    "pagination": {
                      "$ref": "#/definitions/Pagination"
                    }
                  }
                }
              }
            }
          },
          "400": {
            "$ref": "#/responses/Problem"
          }
        }
      }
    },
    "/permissions": {
      "get": {
        "summary": "List permissions",
        "responses": {
          "206": {
            "description": "Ok",
            "schema": {
              "type": "object",
              "properties": {
                "result": {
                  "type": "object",
                  "required": [
                    "pagination"
                  ],
                  "properties": {
                    "data": {
                      "type": "array",
                      "items": {
                        "type": "string"
                      }
                    },
                    "pagination": {
                      "$ref": "#/definitions/Pagination"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/teams": {
      "get": {
        "summary": "List teams",
        "responses": {
          "2XX": {
            "description": "Ok",
            "schema": {
              "type": "object",
              "properties": {
                "result": {
                  "type": "object",
                  "required": [
                    "pagination"
                  ],
                  "properties": {
                    "data": {
                      "type": "array",
                      "items": {
                        "$ref": "#/definitions/Group"
                      }
                    },
                    "pagination": {
                      "$ref": "#/definitions/Pagination"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/organizations": {
      "get": {
        "summary": "List organizations",
        "responses": {
          "200": {
            "description": "Ok",
            "schema": {
              "allOf": [
                {
                  "$ref": "#/definitions/OrganizationEnvelope"
                }
              ]
            }
          },
          "400": {
            "$ref": "#/responses/Problem"
          }
        }
      }
    },
    "/notifications": {
      "get": {
        "summary": "List notifications",
        "responses": {
          "200": {
            "description": "Ok",
            "schema": {
              "type": "object",
              "properties": {
                "result": {
                  "type": "object",
                  "required": [
                    "pagination"
                  ],
                  "properties": {
                    "data": {
                      "type": "array",
                      "items": {
                        "type": "string"
                      }
                    },
                    "pagination": {
                      "oneOf": [
                        {
                          "$ref": "#/definitions/Pagination"
                        },
                        {
                          "type": "null"
                        }
                      ]
                    }
                  },
                  "x-nullable": true
                }
              }
            }
          },
          "400": {
            "$ref": "#/responses/Problem"
          }
        }
      }
    },
    "/invitations": {
      "get": {
        "summary": "List invitations",
        "responses": {
          "200": {
            "description": "Ok",
            "schema": {
              "type": "object",
              "properties": {
                "result": {
                  "type": "object",
                  "required": [
                    "pagination"
                  ],
                  "properties": {
                    "values": {
                      "type": "array",
                      "items": {
                        "type": "string"
                      }
                    },
                    "pagination": {
                      "$ref": "#/definitions/Pagination"
                    }
                  }
                }
              }
            }
          },
          "400": {
            "$ref": "#/responses/Problem"
          }
        }
      }
    },
    "/settings/{settingId}": {
      "get": {
        "summary": "Get a setting with a malformed paging block",
        "parameters": [
          {
            "name": "settingId",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responses": {
          "200": {
            "description": "Ok",
            "schema": {
              "type": "object",
              "properties": {
                "result": {
                  "type": "object",
                  "properties": {
                    "pagination": {
                      "type": "string"
                    }
                  }
                }
              }
            }
          },
          "400": {
            "$ref": "#/responses/Problem"
          }
        }
      }
    },
    "/exports": {
      "get": {
        "summary": "Export the users",
        "produces": [
          "text/csv"
        ],
        "responses": {
          "200": {
            "description": "Ok"
          },
          "400": {
            "$ref": "#/responses/Problem"
          }
        }
      }
    },
    "/reports": {
      "get": {
        "summary": "Download the report",
        "produces": [
          "application/pdf"
        ],
        "responses": {
          "200": {
            "description": "Ok"
          },
          "400": {
            "$ref": "#/responses/Problem"
          }
        }
      }
    },
    "/locales": {
      "get": {
        "summary": "List locales",
        "produces": [
          "application/json",
          "text/csv"
        ],
        "responses": {
          "200": {
            "description": "Ok",
            "schema": {
              "type": "object",
              "properties": {
                "result": {
                  "type": "object",
                  "required": [
                    "pagination"
                  ],
                  "properties": {
                    "records": {
                      "type": "array",
                      "items": {
                        "type": "string"
                      }
                    },
                    "pagination": {
                      "$ref": "#/definitions/Pagination"
                    }
                  }
                }
              }
            }
          },
          "400": {
            "$ref": "#/responses/Problem"
          }
        }
      }
    }
  },
  "responses": {
    "Problem": {
      "description": "Problem.",
      "schema": {
        "type": "object",
        "properties": {
          "result": {
            "type": "object",
            "properties": {
              "errors": {
                "type": "array",
                "items": {
                  "type": "string"
                }
              }
            }
          }
        }
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
    "Pagination": {
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
          "type": "integer"
        },
        "numPages": {
          "type": "integer"
        },
        "links": {
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
        }
      }
    },
    "PaginationStartString": {
      "type": "object",
      "required": [
        "start",
        "limit",
        "links"
      ],
      "properties": {
        "start": {
          "type": "string"
        },
        "limit": {
          "type": "integer"
        },
        "links": {
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
        }
      }
    },
    "PaginationSelfOnly": {
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
        "links": {
          "type": "object",
          "required": [
            "self"
          ],
          "properties": {
            "self": {
              "$ref": "#/definitions/Link"
            }
          }
        }
      }
    },
    "PaginationNotListed": {
      "type": "object",
      "properties": {
        "start": {
          "type": "integer"
        },
        "limit": {
          "type": "integer"
        },
        "links": {
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
        }
      }
    },
    "User": {
      "type": "object",
      "properties": {
        "userId": {
          "type": "string"
        },
        "roles": {
          "type": "array",
          "items": {
            "type": "string"
          }
        }
      }
    },
    "Group": {
      "type": "object",
      "properties": {
        "groupId": {
          "type": "string"
        }
      }
    },
    "Role": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string"
        }
      }
    },
    "UserPage": {
      "type": "object",
      "properties": {
        "result": {
          "type": "object",
          "required": [
            "pagination"
          ],
          "properties": {
            "data": {
              "type": "array",
              "items": {
                "$ref": "#/definitions/User"
              }
            },
            "pagination": {
              "$ref": "#/definitions/Pagination"
            }
          }
        }
      }
    },
    "PagedResult": {
      "type": "object",
      "required": [
        "pagination"
      ],
      "properties": {
        "pagination": {
          "$ref": "#/definitions/Pagination"
        }
      }
    },
    "PagedResultNotListed": {
      "type": "object",
      "required": [
        "pagination"
      ],
      "properties": {
        "pagination": {
          "$ref": "#/definitions/PaginationNotListed"
        }
      }
    },
    "OrganizationEnvelope": {
      "type": "object",
      "properties": {
        "result": {
          "allOf": [
            {
              "$ref": "#/definitions/PagedResult"
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
        }
      }
    },
    "OrganizationEnvelopeNotListed": {
      "type": "object",
      "properties": {
        "result": {
          "allOf": [
            {
              "$ref": "#/definitions/PagedResultNotListed"
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
        }
      }
    }
  }
};
