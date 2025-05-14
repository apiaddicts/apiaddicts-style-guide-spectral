module.exports = {
  "openapi": "3.0.1",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore"
  },
  "paths": {
    "/pets": {
      "get": {                       // Noncompliant {{OAR046: Associate a tag to this operation}}
        "responses": {
          "200": { "description": "OK" }
        }
      },
      "post": {                      // Noncompliant {{OAR046: Associate a tag to this operation}}
        "responses": {
          "default": { "description": "the default response" }
        }
      }
    }
  }
};

