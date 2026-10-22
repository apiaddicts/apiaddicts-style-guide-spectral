module.exports = {
  "openapi": "3.0.3",
  "info": {
    "title": "Customer Identity API",
    "version": "1.4.0"
  },
  "servers": [
    {
      "url": "https://api.example.com/identity/v1"
    }
  ],
  "paths": {
    "/me": {
      "get": {
        "summary": "Get the signed in customer with the legacy device list",
        "operationId": "getMe",
        "responses": {
          "200": {
            "description": "Current customer devices.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "data": {
                      "type": "array",
                      "items": {
                        "$ref": "#/components/schemas/Device"
                      }
                    }
                  }
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
    "/health": {
      "get": {
        "summary": "Health checks as a bare array",
        "operationId": "getHealth",
        "responses": {
          "200": {
            "description": "Checks.",
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
          "404": {
            "$ref": "#/components/responses/Problem"
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
                      "type": "object"
                    }
                  }
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
    "/status": {
      "get": {
        "summary": "Status of every dependency",
        "operationId": "getStatus",
        "responses": {
          "200": {
            "description": "Status.",
            "content": {
              "application/json": {
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
              }
            }
          },
          "404": {
            "$ref": "#/components/responses/Problem"
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
          },
          "404": {
            "$ref": "#/components/responses/Problem"
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
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "data": {
                      "type": "array",
                      "nullable": true,
                      "items": {
                        "$ref": "#/components/schemas/Device"
                      }
                    }
                  }
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
    "/users/me/sessions": {
      "get": {
        "summary": "List the sessions of the signed in user as a bare array",
        "operationId": "listMySessions",
        "responses": {
          "200": {
            "description": "Sessions found.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "nullable": true,
                  "items": {
                    "type": "string"
                  }
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
    "/users/{userId}": {
      "get": {
        "summary": "Get user with a malformed paging block",
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
                  "type": "object",
                  "properties": {
                    "data": {
                      "$ref": "#/components/schemas/User"
                    },
                    "paging": {
                      "type": "string"
                    }
                  }
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
    "/reports": {
      "get": {
        "summary": "List reports",
        "operationId": "listReports",
        "responses": {
          "200": {
            "description": "Reports found.",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ReportList"
                }
              }
            }
          },
          "404": {
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
    "schemas": {
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
            "$ref": "#/components/schemas/Paging"
          }
        }
      }
    }
  }
};
