module.exports = {
  "openapi": "3.1.0",
  "info": {
    "title": "Identity Directory API",
    "summary": "Users, groups and memberships.",
    "description": "Every response wraps its payload in a result envelope; collections carry result.pagination. Nullable values use the array form of type.",
    "version": "3.1.0",
    "license": {
      "name": "Apache 2.0",
      "identifier": "Apache-2.0"
    }
  },
  "servers": [
    {
      "url": "https://api.example.com/identity/v3"
    }
  ],
  "paths": {
    "/users": {
      "get": {
        "summary": "List users",
        "operationId": "listUsers",
        "responses": {
          "200": {
            "description": "Users found.",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UserPage",
                  "description": "Paged users."
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
        "operationId": "getMe",
        "responses": {
          "200": {
            "description": "Current user.",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UserResult"
                }
              }
            }
          }
        }
      }
    },
    "/users/{userId}": {
      "get": {
        "summary": "Get user",
        "operationId": "getUser",
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
            "description": "User found.",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UserResult"
                }
              }
            }
          }
        }
      }
    },
    "/groups": {
      "get": {
        "summary": "List groups with a nullable result",
        "operationId": "listGroups",
        "responses": {
          "200": {
            "description": "Groups found.",
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
                          "type": [
                            "array",
                            "null"
                          ],
                          "items": {
                            "$ref": "#/components/schemas/Group"
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
          }
        }
      }
    },
    "/memberships": {
      "get": {
        "summary": "List memberships",
        "operationId": "listMemberships",
        "responses": {
          "200": {
            "description": "Memberships found.",
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
                        },
                        "pagination": {
                          "type": [
                            "null",
                            "object"
                          ],
                          "required": [
                            "start",
                            "limit",
                            "links"
                          ],
                          "properties": {
                            "start": {
                              "type": [
                                "integer",
                                "null"
                              ]
                            },
                            "limit": {
                              "type": "integer"
                            },
                            "links": {
                              "$ref": "#/components/schemas/PaginationLinks"
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
        }
      }
    },
    "/teams": {
      "get": {
        "summary": "List teams whose result has a null branch",
        "operationId": "listTeams",
        "responses": {
          "200": {
            "description": "Teams found.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "result": {
                      "anyOf": [
                        {
                          "$ref": "#/components/schemas/TeamResult"
                        },
                        {
                          "type": "null"
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
    "/invitations": {
      "get": {
        "summary": "List invitations whose paging block is a null branch first",
        "operationId": "listInvitations",
        "responses": {
          "200": {
            "description": "Invitations found.",
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
                          "oneOf": [
                            {
                              "type": "null"
                            },
                            {
                              "$ref": "#/components/schemas/Pagination"
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
        }
      }
    },
    "/fleets": {
      "get": {
        "summary": "List fleets through $defs",
        "operationId": "listFleets",
        "responses": {
          "200": {
            "description": "Fleets found.",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/FleetEnvelope/$defs/FleetPage"
                }
              }
            }
          }
        }
      }
    },
    "/archived-users": {
      "$ref": "#/components/pathItems/ArchivedUsers"
    },
    "/users/{userId}/sessions/{sessionId}": {
      "get": {
        "summary": "Get a session with its token history",
        "operationId": "getSession",
        "parameters": [
          {
            "name": "userId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "sessionId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Session found.",
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
          }
        }
      }
    },
    "/status": {
      "get": {
        "summary": "Status with a null result",
        "operationId": "getStatus",
        "responses": {
          "200": {
            "description": "Status.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "result": {
                      "type": "null"
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
  "webhooks": {
    "userCreated": {
      "post": {
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/UserResult"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Acknowledged."
          }
        }
      }
    }
  },
  "components": {
    "pathItems": {
      "ArchivedUsers": {
        "get": {
          "summary": "List archived users",
          "operationId": "listArchivedUsers",
          "responses": {
            "200": {
              "description": "Archived users found.",
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
      "PaginationLinks": {
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
            "type": [
              "integer",
              "null"
            ]
          },
          "links": {
            "$ref": "#/components/schemas/PaginationLinks"
          }
        }
      },
      "User": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "aliases": {
            "type": [
              "array",
              "null"
            ],
            "items": {
              "type": "string"
            }
          }
        }
      },
      "Group": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          }
        }
      },
      "UserPage": {
        "type": "object",
        "properties": {
          "result": {
            "type": "object",
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
      "UserResult": {
        "type": "object",
        "properties": {
          "result": {
            "type": [
              "object",
              "null"
            ],
            "properties": {
              "data": {
                "$ref": "#/components/schemas/User"
              }
            }
          }
        }
      },
      "TeamResult": {
        "type": "object",
        "properties": {
          "data": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/Group"
            }
          },
          "pagination": {
            "$ref": "#/components/schemas/Pagination"
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
    }
  }
};
