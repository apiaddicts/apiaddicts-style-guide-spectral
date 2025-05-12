module.exports = {
  "openapi": "3.0.1",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore"
  },
  "tags": [
    {
      "name": "used-tag",
      "description": "a tag referenced in the operations"
    },
    {
      "name": "other-tag",
      "description": "a tag referenced in the operations"
    }
  ],
  "paths": {
    "/pets": {
      "get": {
        "tags": [
          "used-tag"
        ],
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      },
      "post": {
        "tags": [
          "other-tag"
        ],
        "responses": {
          "default": {
            "description": "the default response"
          }
        }
      }
    }
  }
};
