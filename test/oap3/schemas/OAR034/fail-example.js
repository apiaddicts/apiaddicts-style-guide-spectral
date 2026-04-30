module.exports = {
  "openapi": "3.0.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore"
  },
  "paths": {
    "/endpoint": {
      "get": {
        "responses": {
          "206": {
            "description": "Ok",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "items": {
                      "type": "array",
                      "items": {
                        "type": "string"
                      }
                    }
                  }
                }
              }
            }
          },
          "204": {
            "description": "No content"
          },
          "400": {
            "description": "Error"
          },
          "default": {
            "description": "Unknown"
          }
        }
      }
    }
  }
};
