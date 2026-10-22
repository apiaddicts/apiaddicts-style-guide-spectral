module.exports = {
  "openapi": "3.1.0",
  "info": {
    "title": "Identity Directory API",
    "description": "Every response wraps its payload in a result object that carries the pagination of collections.",
    "version": "4.0.0"
  },
  "servers": [
    {
      "url": "https://api.example.com/identity/v4"
    }
  ],
  "paths": {
    "/users": {
      "get": {
        "summary": "List users",
        "responses": {
          "200": {
            "description": "Ok",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UserPage"
                }
              }
            }
          },
          "400": {
            "$ref": "#/components/responses/Problem"
          }
        }
      },
      "post": {
        "summary": "Bulk create users",
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
                        "$ref": "#/components/schemas/User"
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
    "/users/me": {
      "get": {
        "summary": "Get the signed in user",
        "responses": {
          "200": {
            "description": "Ok",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "result": {
                      "type": "object",
                      "properties": {
                        "data": {
                          "$ref": "#/components/schemas/User"
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "400": {
            "$ref": "#/components/responses/Problem"
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
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Ok",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "result": {
                      "type": "object",
                      "properties": {
                        "data": {
                          "$ref": "#/components/schemas/User"
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "400": {
            "$ref": "#/components/responses/Problem"
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
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Ok",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "result": {
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
                  }
                }
              }
            }
          },
          "400": {
            "$ref": "#/components/responses/Problem"
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
            "content": {
              "application/json": {
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
                            "$ref": "#/components/schemas/Group"
                          }
                        },
                        "pagination": {
                          "type": "object"
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "400": {
            "$ref": "#/components/responses/Problem"
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
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "result": {
                      "type": "array",
                      "items": {
                        "$ref": "#/components/schemas/Role"
                      }
                    }
                  }
                }
              }
            }
          },
          "400": {
            "$ref": "#/components/responses/Problem"
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
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "type": "string"
                  }
                }
              }
            }
          },
          "400": {
            "$ref": "#/components/responses/Problem"
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
                    "pagination": {
                      "$ref": "#/components/schemas/Pagination"
                    }
                  }
                }
              }
            }
          },
          "400": {
            "$ref": "#/components/responses/Problem"
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
            "content": {
              "application/json": {
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
                          "$ref": "#/components/schemas/PaginationStartString"
                        }
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
    "/teams": {
      "get": {
        "summary": "List teams",
        "responses": {
          "2XX": {
            "description": "Ok",
            "content": {
              "application/json": {
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
                            "$ref": "#/components/schemas/Group"
                          }
                        },
                        "pagination": {
                          "$ref": "#/components/schemas/PaginationSelfOnly"
                        }
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
    "/organizations": {
      "get": {
        "summary": "List organizations",
        "responses": {
          "200": {
            "description": "Ok",
            "content": {
              "application/json": {
                "schema": {
                  "allOf": [
                    {
                      "$ref": "#/components/schemas/OrganizationEnvelopeNotListed"
                    }
                  ]
                }
              }
            }
          },
          "400": {
            "$ref": "#/components/responses/Problem"
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
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "result": {
                      "type": [
                        "object",
                        "null"
                      ],
                      "properties": {
                        "data": {
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
            }
          },
          "400": {
            "$ref": "#/components/responses/Problem"
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
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "result": {
                      "type": "object",
                      "properties": {
                        "values": {
                          "type": "array",
                          "items": {
                            "type": "string"
                          }
                        },
                        "pagination": {
                          "$ref": "#/components/schemas/Pagination"
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "400": {
            "$ref": "#/components/responses/Problem"
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
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Ok",
            "content": {
              "application/json": {
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
              }
            }
          },
          "400": {
            "$ref": "#/components/responses/Problem"
          }
        }
      }
    },
    "/exports": {
      "get": {
        "summary": "Export the users",
        "responses": {
          "200": {
            "description": "Ok"
          },
          "400": {
            "$ref": "#/components/responses/Problem"
          }
        }
      }
    },
    "/locales": {
      "get": {
        "summary": "List locales in several formats",
        "responses": {
          "200": {
            "description": "Ok",
            "content": {
              "application/json": {
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
                          "$ref": "#/components/schemas/Pagination"
                        }
                      }
                    }
                  }
                }
              },
              "text/csv": {
                "schema": {
                  "type": "string"
                }
              },
              "application/hal+json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "records": {
                      "type": "array",
                      "items": {
                        "type": "string"
                      }
                    }
                  }
                }
              }
            }
          },
          "400": {
            "$ref": "#/components/responses/Problem"
          }
        }
      }
    },
    "/archived-users": {
      "$ref": "#/components/pathItems/ArchivedUsers"
    },
    "/fleets": {
      "get": {
        "summary": "List fleets",
        "responses": {
          "200": {
            "description": "Ok",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/FleetEnvelope/$defs/FleetPage"
                }
              }
            }
          },
          "400": {
            "$ref": "#/components/responses/Problem"
          }
        }
      }
    }
  },
  "components": {
    "responses": {
      "Problem": {
        "description": "Problem.",
        "content": {
          "application/json": {
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
            "type": [
              "integer",
              "null"
            ]
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
                "$ref": "#/components/schemas/Link"
              },
              "previous": {
                "$ref": "#/components/schemas/Link"
              },
              "next": {
                "$ref": "#/components/schemas/Link"
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
                "$ref": "#/components/schemas/Link"
              },
              "previous": {
                "$ref": "#/components/schemas/Link"
              },
              "next": {
                "$ref": "#/components/schemas/Link"
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
                "$ref": "#/components/schemas/Link"
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
                "$ref": "#/components/schemas/Link"
              },
              "previous": {
                "$ref": "#/components/schemas/Link"
              },
              "next": {
                "$ref": "#/components/schemas/Link"
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
                  "$ref": "#/components/schemas/User"
                }
              },
              "pagination": {
                "$ref": "#/components/schemas/Pagination"
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
            "$ref": "#/components/schemas/Pagination"
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
            "$ref": "#/components/schemas/PaginationNotListed"
          }
        }
      },
      "OrganizationEnvelope": {
        "type": "object",
        "properties": {
          "result": {
            "allOf": [
              {
                "$ref": "#/components/schemas/PagedResult"
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
                "$ref": "#/components/schemas/PagedResultNotListed"
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
      "FleetEnvelope": {
        "type": "object",
        "$defs": {
          "FleetPage": {
            "type": "object",
            "properties": {
              "result": {
                "type": "object",
                "properties": {
                  "list": {
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
      }
    },
    "pathItems": {
      "ArchivedUsers": {
        "get": {
          "summary": "List archived users",
          "responses": {
            "200": {
              "description": "Ok",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "result": {
                        "type": "object",
                        "properties": {
                          "rows": {
                            "type": "array",
                            "items": {
                              "$ref": "#/components/schemas/User"
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            "400": {
              "$ref": "#/components/responses/Problem"
            }
          }
        }
      }
    }
  },
  "webhooks": {
    "userCreated": {
      "post": {
        "responses": {
          "200": {
            "description": "Ok",
            "content": {
              "application/json": {
                "schema": {
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
    }
  }
};
