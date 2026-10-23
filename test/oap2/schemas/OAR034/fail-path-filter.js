module.exports = {
  "swagger": "2.0",
  "info": {
    "title": "Customer Identity API",
    "version": "1.4.0"
  },
  "host": "api.example.com",
  "basePath": "/identity/v1",
  "produces": [
    "application/json"
  ],
  "paths": {
    "/me": {
      "get": {
        "summary": "Get the signed in customer with the legacy device list",
        "operationId": "getMe",
        "responses": {
          "200": {
            "description": "Current customer devices.",
            "schema": {
              "type": "object",
              "properties": {
                "data": {
                  "type": "array",
                  "items": {
                    "$ref": "#/definitions/Device"
                  }
                }
              }
            }
          },
          "404": {
            "$ref": "#/responses/Problem"
          }
        }
      }
    },
    "/health": {
      "get": {
        "summary": "Health checks as a bare array",
        "operationId": "getHealth",
        "responses": {
          "200": {
            "description": "Checks.",
            "schema": {
              "type": "array",
              "items": {
                "type": "string"
              }
            }
          },
          "404": {
            "$ref": "#/responses/Problem"
          }
        }
      }
    },
    "/ping": {
      "get": {
        "summary": "Ping with a placeholder paging block",
        "operationId": "ping",
        "responses": {
          "200": {
            "description": "Pong.",
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
                  "type": "object"
                }
              }
            }
          },
          "404": {
            "$ref": "#/responses/Problem"
          }
        }
      }
    },
    "/status": {
      "get": {
        "summary": "Status of every dependency",
        "operationId": "getStatus",
        "responses": {
          "200": {
            "description": "Status.",
            "schema": {
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
          },
          "404": {
            "$ref": "#/responses/Problem"
          }
        }
      }
    },
    "/users": {
      "get": {
        "summary": "List users",
        "operationId": "listUsers",
        "responses": {
          "200": {
            "description": "Users found.",
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
          },
          "404": {
            "$ref": "#/responses/Problem"
          }
        }
      }
    },
    "/users/me": {
      "get": {
        "summary": "List the devices of the signed in user",
        "operationId": "listMyDevices",
        "responses": {
          "200": {
            "description": "Devices found.",
            "schema": {
              "type": "object",
              "properties": {
                "data": {
                  "type": "array",
                  "x-nullable": true,
                  "items": {
                    "$ref": "#/definitions/Device"
                  }
                }
              }
            }
          },
          "404": {
            "$ref": "#/responses/Problem"
          }
        }
      }
    },
    "/users/me/sessions": {
      "get": {
        "summary": "List the sessions of the signed in user as a bare array",
        "operationId": "listMySessions",
        "responses": {
          "200": {
            "description": "Sessions found.",
            "schema": {
              "type": "array",
              "x-nullable": true,
              "items": {
                "type": "string"
              }
            }
          },
          "404": {
            "$ref": "#/responses/Problem"
          }
        }
      }
    },
    "/users/{userId}": {
      "get": {
        "summary": "Get user with a malformed paging block",
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
              "type": "object",
              "properties": {
                "data": {
                  "$ref": "#/definitions/User"
                },
                "paging": {
                  "type": "string"
                }
              }
            }
          },
          "404": {
            "$ref": "#/responses/Problem"
          }
        }
      }
    },
    "/reports": {
      "get": {
        "summary": "List reports",
        "operationId": "listReports",
        "responses": {
          "200": {
            "description": "Reports found.",
            "schema": {
              "$ref": "#/definitions/ReportList"
            }
          },
          "404": {
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
          "errors": {
            "type": "array",
            "items": {
              "type": "string"
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
    "Device": {
      "type": "object",
      "properties": {
        "serial": {
          "type": "string"
        }
      }
    },
    "ReportList": {
      "type": "object",
      "properties": {
        "records": {
          "type": "array",
          "items": {
            "type": "string"
          }
        }
      }
    },
    "ReportPage": {
      "type": "object",
      "properties": {
        "records": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "paging": {
          "$ref": "#/definitions/Paging"
        }
      }
    }
  }
};
