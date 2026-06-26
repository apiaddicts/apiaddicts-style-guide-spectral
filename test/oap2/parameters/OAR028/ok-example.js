module.exports = {
  "swagger": "2.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore"
  },
  "host": "petstore.swagger.io",
  "basePath": "/v2",
  "paths": {
    "/filter-only": {
      "get": {
        "parameters": [
          {
            "name": "$filter",
            "in": "query",
            "type": "string"
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
            "type": "string"
          },
          {
            "name": "limit",
            "in": "query",
            "type": "integer"
          },
          {
            "name": "offset",
            "in": "query",
            "type": "integer"
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
            "type": "integer"
          },
          {
            "name": "X-Request-ID",
            "in": "header",
            "type": "string"
          },
          {
            "name": "$filter",
            "in": "query",
            "type": "string"
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
        "parameters": [],
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
    "/mixed-methods": {
      "get": {
        "parameters": [
          {
            "name": "$filter",
            "in": "query",
            "type": "string"
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
            "type": "string"
          },
          {
            "name": "sort",
            "in": "query",
            "type": "string"
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
            "type": "string"
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
            "type": "integer"
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