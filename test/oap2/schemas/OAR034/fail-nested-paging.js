module.exports = {
  "swagger": "2.0",
  "info": {
    "title": "Identity Directory API",
    "description": "Every response wraps its payload in a result envelope; collections carry result.pagination.",
    "version": "1.9.0"
  },
  "host": "api.example.com",
  "basePath": "/identity/v1",
  "schemes": [
    "https"
  ],
  "produces": [
    "application/json"
  ],
  "tags": [
    {
      "name": "users"
    },
    {
      "name": "groups"
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
            "name": "$start",
            "in": "query",
            "type": "integer"
          },
          {
            "name": "$limit",
            "in": "query",
            "type": "integer"
          }
        ],
        "responses": {
          "200": {
            "description": "Users found.",
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
        "tags": [
          "users"
        ],
        "summary": "Bulk create users",
        "operationId": "createUsers",
        "responses": {
          "201": {
            "description": "Users created.",
            "schema": {
              "$ref": "#/definitions/UserCollectionResult"
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
            "schema": {
              "$ref": "#/definitions/UserResult"
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
            "name": "userId",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responses": {
          "200": {
            "description": "User found.",
            "schema": {
              "$ref": "#/definitions/UserResult"
            }
          },
          "404": {
            "$ref": "#/responses/Problem"
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
            "name": "userId",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responses": {
          "200": {
            "$ref": "#/responses/SessionList"
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
            "schema": {
              "type": "object",
              "properties": {
                "result": {
                  "type": "object",
                  "properties": {
                    "items": {
                      "type": "array",
                      "items": {
                        "$ref": "#/definitions/Group"
                      }
                    },
                    "pagination": {
                      "type": "object",
                      "properties": {
                        "start": {
                          "type": "integer"
                        },
                        "limit": {
                          "type": "integer"
                        },
                        "links": {
                          "$ref": "#/definitions/PaginationLinks"
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
    "/roles": {
      "get": {
        "tags": [
          "groups"
        ],
        "summary": "List roles as an array result",
        "operationId": "listRoles",
        "responses": {
          "200": {
            "description": "Roles found.",
            "schema": {
              "type": "object",
              "properties": {
                "result": {
                  "type": "array",
                  "x-nullable": true,
                  "items": {
                    "$ref": "#/definitions/Role"
                  }
                }
              }
            }
          }
        }
      }
    },
    "/devices": {
      "get": {
        "tags": [
          "users"
        ],
        "summary": "List devices as a bare array",
        "operationId": "listDevices",
        "responses": {
          "200": {
            "description": "Devices found.",
            "schema": {
              "type": "array",
              "items": {
                "type": "string"
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
            "schema": {
              "$ref": "#/definitions/PermissionPage"
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
            "schema": {
              "allOf": [
                {
                  "$ref": "#/definitions/OrganizationEnvelope"
                }
              ]
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
            "schema": {
              "type": "object",
              "properties": {
                "result": {
                  "type": "object",
                  "x-nullable": true,
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
          }
        }
      }
    },
    "/settings/{settingId}": {
      "get": {
        "tags": [
          "users"
        ],
        "summary": "Get a setting with a malformed paging block",
        "operationId": "getSetting",
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
            "description": "Setting found.",
            "schema": {
              "type": "object",
              "properties": {
                "result": {
                  "type": "object",
                  "properties": {
                    "pagination": {
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
    "/users/{userId}/avatar/{size}": {
      "get": {
        "tags": [
          "users"
        ],
        "summary": "Download an avatar",
        "operationId": "getAvatar",
        "produces": [
          "image/png"
        ],
        "parameters": [
          {
            "name": "userId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "size",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responses": {
          "200": {
            "description": "Avatar.",
            "schema": {
              "type": "file"
            }
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
    },
    "SessionList": {
      "description": "Sessions found.",
      "schema": {
        "type": "object",
        "properties": {
          "result": {
            "type": "object",
            "properties": {
              "data": {
                "type": "array",
                "items": {
                  "$ref": "#/definitions/Session"
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
    "PaginationLinks": {
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
          "$ref": "#/definitions/PaginationLinks"
        }
      }
    },
    "User": {
      "type": "object",
      "properties": {
        "id": {
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
    "UserResult": {
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
                "$ref": "#/definitions/User"
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
                "type": "string"
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
                      "type": "object",
                      "properties": {
                        "href": {
                          "type": "integer"
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
    "PagedResult": {
      "type": "object",
      "properties": {
        "pagination": {
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
              "$ref": "#/definitions/PaginationLinks"
            }
          }
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
    }
  }
};
