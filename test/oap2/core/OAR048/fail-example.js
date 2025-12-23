module.exports = {
  "swagger": "2.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore"
  },
  "parameters": {
    "CommonBody": {
      "in": "body",
      "name": "commonBody",
      "required": true,
      "schema": {
        "type": "object"
      }
    }
  },
  "paths": {
    "/pets": {
      "post": {
        "parameters": [
          {
            "in": "body",
            "name": "someParam",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "in": "body",
            "name": "otherParam",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "default": {
            "description": "the default response"
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
            "$ref": "#/parameters/CommonBody"
          },
          {
            "in": "body",
            "name": "extraBody",
            "required": false,
            "schema": {
              "type": "object"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Updated"
          }
        }
      }
    }
  }
};
