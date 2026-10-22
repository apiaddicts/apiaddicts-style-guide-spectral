module.exports = {
  "openapi": "3.0.3",
  "info": {
    "title": "Identity Directory API",
    "description": "Every response wraps its payload in a result envelope; collections carry result.pagination.",
    "version": "2.5.0"
  },
  "servers": [
    {
      "url": "https://api.example.com/identity/v2"
    }
  ],
  "tags": [
    {
      "name": "users"
    },
    {
      "name": "groups"
    },
    {
      "name": "settings"
    }
  ],
  "paths": {
    "/users": {
      "get": {
        "tags": [
          "users"
        ],
        "summary": "List users",
        "operationId": "listUsers",
        "parameters": [
          {
            "$ref": "#/components/parameters/start"
          },
          {
            "$ref": "#/components/parameters/limit"
          }
        ],
        "responses": {
          "200": {
            "description": "Users found.",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UserPage"
                }
              }
            }
          },
          "204": {
            "description": "No users."
          },
          "400": {
            "$ref": "#/components/responses/Problem"
          },
          "default": {
            "$ref": "#/components/responses/Problem"
          }
        }
      },
      "post": {
        "tags": [
          "users"
        ],
        "summary": "Bulk create users",
        "operationId": "createUsers",
        "responses": {
          "201": {
            "description": "Users created.",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UserCollectionResult"
                }
              }
            }
          }
        }
      }
    },
    "/users/me": {
      "get": {
        "tags": [
          "users"
        ],
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
    "/users/me/preferences": {
      "get": {
        "tags": [
          "users"
        ],
        "summary": "Get the preferences of the signed in user",
        "operationId": "getMyPreferences",
        "responses": {
          "200": {
            "description": "Preferences.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "result": {
                      "type": "object",
                      "properties": {
                        "data": {
                          "type": "object",
                          "properties": {
                            "language": {
                              "type": "string"
                            },
                            "favouriteGroups": {
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
        }
      }
    },
    "/users/{userId}": {
      "get": {
        "tags": [
          "users"
        ],
        "summary": "Get user",
        "operationId": "getUser",
        "parameters": [
          {
            "$ref": "#/components/parameters/userId"
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
          },
          "404": {
            "$ref": "#/components/responses/Problem"
          }
        }
      }
    },
    "/users/{userId}/sessions": {
      "get": {
        "tags": [
          "users"
        ],
        "summary": "List active sessions of a user",
        "operationId": "listUserSessions",
        "parameters": [
          {
            "$ref": "#/components/parameters/userId"
          }
        ],
        "responses": {
          "200": {
            "description": "Sessions found.",
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
                            "$ref": "#/components/schemas/Session"
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
    "/users/{userId}/friends/{friendId}": {
      "get": {
        "tags": [
          "users"
        ],
        "summary": "Get a friend link with its shared groups",
        "operationId": "getFriend",
        "parameters": [
          {
            "$ref": "#/components/parameters/userId"
          },
          {
            "name": "friendId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Friend found.",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UserCollectionResult"
                }
              }
            }
          }
        }
      }
    },
    "/groups": {
      "get": {
        "tags": [
          "groups"
        ],
        "summary": "List groups",
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
                      "type": "object",
                      "properties": {
                        "items": {
                          "type": "array",
                          "items": {
                            "$ref": "#/components/schemas/Group"
                          }
                        },
                        "pagination": {
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
    "/permissions": {
      "get": {
        "tags": [
          "groups"
        ],
        "summary": "List permissions",
        "operationId": "listPermissions",
        "responses": {
          "206": {
            "description": "Partial permission list.",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/PermissionPage"
                }
              }
            }
          }
        }
      }
    },
    "/teams": {
      "get": {
        "tags": [
          "groups"
        ],
        "summary": "List teams",
        "operationId": "listTeams",
        "responses": {
          "2XX": {
            "description": "Teams found.",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UserPage"
                }
              }
            }
          }
        }
      }
    },
    "/organizations": {
      "get": {
        "tags": [
          "groups"
        ],
        "summary": "List organizations through a composed envelope",
        "operationId": "listOrganizations",
        "responses": {
          "200": {
            "description": "Organizations found.",
            "content": {
              "application/json": {
                "schema": {
                  "allOf": [
                    {
                      "$ref": "#/components/schemas/OrganizationEnvelope"
                    }
                  ]
                }
              }
            }
          }
        }
      }
    },
    "/invitations": {
      "get": {
        "tags": [
          "users"
        ],
        "summary": "List invitations through an alias",
        "operationId": "listInvitations",
        "responses": {
          "200": {
            "description": "Invitations found.",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InvitationPageAlias"
                }
              }
            }
          }
        }
      }
    },
    "/exports": {
      "get": {
        "tags": [
          "settings"
        ],
        "summary": "Get the export token",
        "operationId": "getExport",
        "responses": {
          "200": {
            "description": "Export token.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "result": {
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
    "/status": {
      "get": {
        "tags": [
          "settings"
        ],
        "summary": "Health status with its checks",
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
                      "type": "object",
                      "properties": {
                        "status": {
                          "type": "string"
                        },
                        "checks": {
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
    "/notifications": {
      "get": {
        "tags": [
          "users"
        ],
        "summary": "List notifications",
        "operationId": "listNotifications",
        "responses": {
          "200": {
            "description": "Notifications found.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "result": {
                      "type": "object",
                      "nullable": true,
                      "properties": {
                        "data": {
                          "type": "array",
                          "items": {
                            "type": "string"
                          }
                        },
                        "pagination": {
                          "allOf": [
                            {
                              "$ref": "#/components/schemas/Pagination"
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
      }
    },
    "/locales": {
      "get": {
        "tags": [
          "settings"
        ],
        "summary": "List locales in JSON and XML",
        "operationId": "listLocales",
        "responses": {
          "200": {
            "description": "Locales found.",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/LocalePage"
                }
              },
              "application/xml": {
                "schema": {
                  "$ref": "#/components/schemas/LocalePage"
                }
              }
            }
          }
        }
      }
    }
  },
  "components": {
    "parameters": {
      "start": {
        "name": "$start",
        "in": "query",
        "schema": {
          "type": "integer"
        }
      },
      "limit": {
        "name": "$limit",
        "in": "query",
        "schema": {
          "type": "integer"
        }
      },
      "userId": {
        "name": "userId",
        "in": "path",
        "required": true,
        "schema": {
          "type": "string"
        }
      }
    },
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
          "email": {
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
      "Session": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          }
        }
      },
      "Group": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "members": {
            "type": "array",
            "items": {
              "type": "string"
            }
          }
        }
      },
      "Permission": {
        "type": "object",
        "properties": {
          "scope": {
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
            "type": "object",
            "properties": {
              "data": {
                "$ref": "#/components/schemas/User"
              }
            }
          }
        }
      },
      "UserCollectionResult": {
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
              }
            }
          }
        }
      },
      "PermissionPage": {
        "type": "object",
        "properties": {
          "result": {
            "type": "object",
            "properties": {
              "data": {
                "type": "array",
                "items": {
                  "$ref": "#/components/schemas/Permission"
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
        "properties": {
          "pagination": {
            "$ref": "#/components/schemas/Pagination"
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
      "InvitationPage": {
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
      },
      "InvitationPageAlias": {
        "$ref": "#/components/schemas/InvitationPage"
      },
      "LocalePage": {
        "type": "object",
        "properties": {
          "result": {
            "type": "object",
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
    }
  }
};
