module.exports = {
  "openapi": "3.0.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore"
  },
  "paths": {
    "/pets": {
      "get": {
        "summary": "list all pets",
        "description": "Get all defined pets. The API can be paginated by the client, but the server is allowed to restrict the number of returned results further than what the client has requested.",
        "responses": {
          "default": {
            "description": "The default response"
          }
        }
      }
    }
  }
};
