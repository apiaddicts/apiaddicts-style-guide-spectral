module.exports = {
  "swagger": "2.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore"
  },
  "paths": {
    "/path-level-field": {
      "x-custom-example": true,
      "get": {
        "responses": {
          "200": {
            "description": "Inherited from path"
          }
        }
      }
    },
    "/operation-level-field": {
      "get": {
        "x-custom-example": true,
        "responses": {
          "200": {
            "description": "Inherited from operation"
          }
        }
      }
    },
    "/response-level-field": {
      "get": {
        "responses": {
          "200": {
            "x-custom-example": true,
            "description": "Field at correct final node"
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
            "x-custom-example": true,
            "description": "Correct"
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