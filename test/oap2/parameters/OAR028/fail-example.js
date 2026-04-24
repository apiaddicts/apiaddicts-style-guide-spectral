module.exports = {
  "swagger": "2.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore"
  },
  "host": "petstore.swagger.io",
  "basePath": "/v2",
  "paths": {
    "/no-parameters": {
      "get": {
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    },
    "/empty-parameters": {
      "get": {
        "parameters": [],
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    },
    "/no-filter-param": {
      "get": {
        "parameters": [
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
    "/filter-in-header": {
      "get": {
        "parameters": [
          {
            "name": "$filter",
            "in": "header",
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
    "/filter-in-path": {
      "get": {
        "parameters": [
          {
            "name": "$filter",
            "in": "path",
            "required": true,
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
    "/filter-in-body": {
      "get": {
        "parameters": [
          {
            "name": "$filter",
            "in": "body",
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
    "/filter-no-in": {
      "get": {
        "parameters": [
          {
            "name": "$filter",
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
    "/query-no-filter-name": {
      "get": {
        "parameters": [
          {
            "name": "search",
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
    "/only-refs": {
      "get": {
        "parameters": [
          {
            "$ref": "#/parameters/FilterParam"
          }
        ],
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    },
    "/multiple-a": {
      "get": {
        "parameters": [
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
    "/multiple-b": {
      "get": {
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    }
  },
  "parameters": {
    "FilterParam": {
      "name": "$filter",
      "in": "query",
      "type": "string"
    }
  }
};