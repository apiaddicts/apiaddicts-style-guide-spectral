module.exports = {
  "openapi": "3.0.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore"
  },
  "paths": {
    "/path-level": {
      "x-custom-example": true,
      "get": {
        "responses": {
          "200": {
            "description": "Inherited from path"
          }
        }
      }
    },
    "/operation-level": {
      "get": {
        "x-custom-example": true,
        "responses": {
          "200": {
            "description": "Inherited from operation"
          }
        }
      }
    },
    "/response-level": {
      "get": {
        "responses": {
          "200": {
            "x-custom-example": true,
            "description": "Correct placement"
          }
        }
      }
    },
    "/multiple-methods": {
      "post": {
        "responses": {
          "200": {
            "description": "Ignored"
          }
        }
      },
      "get": {
        "responses": {
          "200": {
            "x-custom-example": true
          }
        }
      }
    },
    "/multiple-responses": {
      "get": {
        "responses": {
          "200": {
            "x-custom-example": true
          },
          "400": {
            "description": "Ignored"
          }
        }
      }
    }
  }
};