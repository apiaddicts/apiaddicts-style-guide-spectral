module.exports = {
  "openapi": "3.0.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore Ref Responses"
  },
  "paths": {
    "/pets": {
      "get": {
        "responses": {
          "$ref": "#/components/responses/StandardGetResponses"
        }
      }
    }
  },
  "components": {
    "responses": {
      "StandardGetResponses": {
        "200": { "description": "OK", "content": { "application/json": { "schema": { "type": "object" } } } }
      }
    }
  }
};
