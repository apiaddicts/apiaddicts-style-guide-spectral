module.exports = {
  "swagger": "2.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore Ref Responses"
  },
  "paths": {
    "/pets": {
      "get": {
        "responses": {
          "$ref": "#/responses/StandardGetResponses"
        }
      }
    }
  },
  "responses": {
    "StandardGetResponses": {
      "200": { "description": "OK", "schema": { "type": "object" } }
    }
  }
};
