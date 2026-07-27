module.exports = {
  "openapi": "3.0.1",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore"
  },
  "paths": {
    "/pets": {
      "post": {
        "requestBody": {
          "content": {
            "application": {},
            "invalid-no-slash": {},
            ".text/plain": {}
          }
        },
        "responses": {
          "200": {
            "description": "some operation",
            "content": {
              "application": {},
              "invalid-no-slash": {},
              ".text/plain": {}
            }
          }
        }
      },
      "get": {
        "responses": {
          "200": {
            "description": "some operation"
          }
        }
      }
    }
  }
};
