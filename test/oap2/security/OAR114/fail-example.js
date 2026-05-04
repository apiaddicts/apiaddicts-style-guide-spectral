module.exports = {
  "swagger": "2.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore"
  },
  "paths": {
    "/pets": {
      "get": {
        "responses": {
          "200": {
            "description": "successful operation",
            "headers": {
              "content-type": {
                "type": "string"
              },
              "authorization": {
                "type": "string"
              }
            }
          }
        }
      }
    },
    "/users": {
      "post": {
        "responses": {
          "201": {
            "description": "created",
            "headers": {
              "x-apiKey": {
                "type": "string"
              },
              "dateTime": {
                "type": "string"
              }
            }
          }
        }
      }
    }
  }
};
