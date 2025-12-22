module.exports = {
  "swagger": "2.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore"
  },
  "parameters": {
    "SharedBody": {
      "in": "body",
      "name": "sharedBody",
      "required": true,
      "schema": {
        "type": "object"
      }
    }
  },
  "paths": {
    "/pets": {
      "get": {
        "parameters": [
          {
            "in": "query",
            "name": "limit",
            "required": false,
            "type": "integer"
          },
          {
            "in": "query",
            "name": "offset",
            "required": false,
            "type": "integer"
          }
        ],
        "responses": {
          "200": {
            "description": "A list of pets"
          }
        }
      },
      "post": {
        "parameters": [
          {
            "in": "body",
            "name": "petBody",
            "required": true,
            "schema": {
              "type": "object",
              "properties": {
                "name": {
                  "type": "string"
                },
                "age": {
                  "type": "integer"
                }
              }
            }
          },
          {
            "in": "query",
            "name": "dryRun",
            "required": false,
            "type": "boolean"
          }
        ],
        "responses": {
          "201": {
            "description": "Pet created"
          }
        }
      }
    },
    "/users": {
      "put": {
        "parameters": [
          {
            "in": "path",
            "name": "userId",
            "required": true,
            "type": "string"
          },
          {
            "$ref": "#/parameters/SharedBody"
          },
          {
            "in": "header",
            "name": "X-Request-ID",
            "required": false,
            "type": "string"
          }
        ],
        "responses": {
          "200": {
            "description": "User updated"
          }
        }
      }
    }
  }
};
