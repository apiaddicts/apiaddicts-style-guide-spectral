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
            "description": "OK without headers"
          },
          "400": {
            "description": "Bad Request with forbidden header",
            "headers": {
              "authorization": {
                "type": "string"
              }
            }
          }
        }
      }
    },
    "/orders": {
      "post": {
        "responses": {
          "200": {
            "description": "Missing mandatory header, extra invalid header",
            "headers": {
              "x-power-by": {
                "type": "string"
              },
              "x-forbidden-header": {
                "type": "string"
              }
            }
          }
        }
      }
    },
    "/customers": {
      "get": {
        "responses": {
          "200": {
            "description": "Headers defined but missing mandatory",
            "headers": {
              "idCorrelacion": {
                "type": "string"
              }
            }
          }
        }
      }
    }
  }
};