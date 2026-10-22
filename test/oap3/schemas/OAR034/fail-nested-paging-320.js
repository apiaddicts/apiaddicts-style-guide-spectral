module.exports = {
  "openapi": "3.2.0",
  "$self": "https://api.example.com/specs/identity/v4/openapi.yaml",
  "info": {
    "title": "Identity Directory API",
    "summary": "Users, groups and audit trail.",
    "description": "Every response wraps its payload in a result envelope; collections carry result.pagination. Reusable media types live in components.mediaTypes.",
    "version": "4.0.0"
  },
  "servers": [
    {
      "url": "https://api.example.com/identity/v4",
      "name": "production"
    }
  ],
  "tags": [
    {
      "name": "users",
      "kind": "nav"
    },
    {
      "name": "audit",
      "parent": "users",
      "kind": "nav"
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
        "responses": {
          "200": {
            "summary": "Users found",
            "description": "Users found.",
            "content": {
              "application/json": {
                "$ref": "#/components/mediaTypes/UserPageJson"
              }
            }
          }
        }
      },
      "query": {
        "tags": [
          "users"
        ],
        "summary": "Search users with a query body",
        "operationId": "searchUsers",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Users found.",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UserCollectionResult"
                }
              }
            }
          }
        }
      },
      "additionalOperations": {
        "LINK": {
          "summary": "Link users",
          "operationId": "linkUsers",
          "responses": {
            "200": {
              "description": "Linked.",
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
            "summary": "Current user",
            "description": "Current user.",
            "content": {
              "application/json": {
                "$ref": "#/components/mediaTypes/UserResultJson"
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
                "$ref": "#/components/mediaTypes/UserResultJson"
              }
            }
          }
        }
      }
    },
    "/groups": {
      "get": {
        "tags": [
          "users"
        ],
        "summary": "List groups through a reusable media type",
        "operationId": "listGroups",
        "responses": {
          "200": {
            "summary": "Groups found",
            "description": "Groups found.",
            "content": {
              "application/json": {
                "$ref": "#/components/mediaTypes/GroupCollectionJson"
              }
            }
          }
        }
      }
    },
    "/audit-events": {
      "get": {
        "tags": [
          "audit"
        ],
        "summary": "List audit events, also streamable",
        "operationId": "listAuditEvents",
        "responses": {
          "200": {
            "description": "Audit events.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "result": {
                      "type": "object",
                      "properties": {
                        "entries": {
                          "type": "array",
                          "items": {
                            "$ref": "#/components/schemas/AuditEvent"
                          }
                        }
                      }
                    }
                  }
                }
              },
              "application/jsonl": {
                "itemSchema": {
                  "$ref": "#/components/schemas/AuditEvent"
                }
              }
            }
          }
        }
      }
    },
    "/audit-exports": {
      "get": {
        "tags": [
          "audit"
        ],
        "summary": "Stream audit exports",
        "operationId": "listAuditExports",
        "responses": {
          "200": {
            "description": "Audit exports.",
            "content": {
              "application/jsonl": {
                "itemSchema": {
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
          }
        }
      }
    },
    "/settings": {
      "get": {
        "tags": [
          "users"
        ],
        "summary": "List settings",
        "operationId": "listSettings",
        "responses": {
          "2XX": {
            "description": "Settings found.",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/SettingPage"
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
        "summary": "List devices as an array result",
        "operationId": "listDevices",
        "responses": {
          "200": {
            "description": "Devices found.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "result": {
                      "type": [
                        "array",
                        "null"
                      ],
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
  },
  "components": {
    "mediaTypes": {
      "UserPageJson": {
        "schema": {
          "$ref": "#/components/schemas/UserPage"
        }
      },
      "UserResultJson": {
        "schema": {
          "$ref": "#/components/schemas/UserResult"
        }
      },
      "GroupCollectionJson": {
        "schema": {
          "type": "object",
          "properties": {
            "result": {
              "type": "object",
              "properties": {
                "results": {
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
          }
        }
      },
      "AuditEvent": {
        "type": "object",
        "properties": {
          "action": {
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
      "SettingPage": {
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
                    "type": "number"
                  },
                  "links": {
                    "type": "object",
                    "required": [
                      "self",
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
              }
            }
          }
        }
      }
    }
  }
};
