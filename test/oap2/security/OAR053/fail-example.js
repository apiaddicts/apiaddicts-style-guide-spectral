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
            "description": "No headers - missing x-trace-id"
          }
        }
      }
    },
    "/users": {
      "put": {
        "responses": {
          "200": {
            "description": "No headers - missing x-trace-id"
          }
        }
      }
    },
    "/orders": {
      "post": {
        "responses": {
          "200": {
            "description": "No headers - missing x-trace-id"
          }
        }
      }
    },
    "/items": {
      "get": {
        "responses": {
          "200": {
            "description": "x-trace-id present but also forbidden header",
            "headers": {
              "x-trace-id": {
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
    "/reports": {
      "post": {
        "responses": {
          "200": {
            "description": "x-trace-id present but also forbidden header",
            "headers": {
              "x-trace-id": {
                "type": "string"
              },
              "server": {
                "type": "string"
              }
            }
          }
        }
      }
    },
    "/invoices": {
      "delete": {
        "responses": {
          "200": {
            "description": "x-trace-id present but also forbidden header",
            "headers": {
              "x-trace-id": {
                "type": "string"
              },
              "content-type": {
                "type": "string"
              }
            }
          }
        }
      }
    }
  }
};