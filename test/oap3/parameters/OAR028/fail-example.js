module.exports = {
  "openapi": "3.0.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore"
  },
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
    "/filter-in-header": {
      "get": {
        "parameters": [
          {
            "name": "$filter",
            "in": "header",
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
    "/filter-in-path": {
      "get": {
        "parameters": [
          {
            "name": "$filter",
            "in": "path",
            "required": true,
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
    "/filter-in-cookie": {
      "get": {
        "parameters": [
          {
            "name": "$filter",
            "in": "cookie",
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
    "/query-no-filter-name": {
      "get": {
        "parameters": [
          {
            "name": "search",
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
    "/only-refs": {
      "get": {
        "parameters": [
          {
            "$ref": "#/components/parameters/FilterParam"
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
  "components": {
    "parameters": {
      "FilterParam": {
        "name": "$filter",
        "in": "query",
        "schema": {
          "type": "string"
        }
      }
    }
  }
};