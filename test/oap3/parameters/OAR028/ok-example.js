module.exports = {
  "openapi": "3.0.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore"
  },
  "paths": {
    "/filter-only": {
      "get": {
        "parameters": [
          {
            "name": "$filter",
            "in": "query",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    },
    "/filter-with-others": {
      "get": {
        "parameters": [
          {
            "name": "$filter",
            "in": "query",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "limit",
            "in": "query",
            "schema": {
              "type": "integer"
            }
          },
          {
            "name": "offset",
            "in": "query",
            "schema": {
              "type": "integer"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    },
    "/filter-with-path-and-header-params": {
      "get": {
        "parameters": [
          {
            "name": "petId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer"
            }
          },
          {
            "name": "X-Request-ID",
            "in": "header",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "$filter",
            "in": "query",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    },
    "/filter-with-cookie-param": {
      "get": {
        "parameters": [
          {
            "name": "session",
            "in": "cookie",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "$filter",
            "in": "query",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    },
    "/post-no-filter": {
      "post": {
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
          "201": {
            "description": "Created"
          }
        }
      }
    },
    "/put-no-filter": {
      "put": {
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    },
    "/delete-no-filter": {
      "delete": {
        "responses": {
          "204": {
            "description": "No Content"
          }
        }
      }
    },
    "/patch-no-filter": {
      "patch": {
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    },
    "/mixed-methods": {
      "get": {
        "parameters": [
          {
            "name": "$filter",
            "in": "query",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      },
      "post": {
        "responses": {
          "201": {
            "description": "Created"
          }
        }
      },
      "delete": {
        "responses": {
          "204": {
            "description": "No Content"
          }
        }
      }
    },
    "/multiple-valid-a": {
      "get": {
        "parameters": [
          {
            "name": "$filter",
            "in": "query",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "sort",
            "in": "query",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    },
    "/multiple-valid-b": {
      "get": {
        "parameters": [
          {
            "name": "$filter",
            "in": "query",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    },
    "/users/me": {
      "get": {
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    },
    "/users/me/settings": {
      "get": {
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    },
    "/pets/{petId}": {
      "get": {
        "parameters": [
          {
            "name": "petId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    },
    "/status": {
      "get": {
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    },
    "/health": {
      "get": {
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    },
    "/ping": {
      "get": {
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    }
  }
};