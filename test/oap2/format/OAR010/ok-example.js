module.exports = {
  "swagger": "2.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore"
  },
  "produces": [
    "application/json"
  ],
  "paths": {
    "/invoices": {
      "get": {
        "responses": {
          "200": {
            "description": "Uses global produces"
          }
        }
      },
      "post": {
        "produces": [
          "application/json"
        ],
        "responses": {
          "200": {
            "description": "Operation level produces"
          }
        }
      },
      "put": {
        "produces": [
          "application/xml",
          "application/json"
        ],
        "responses": {
          "200": {
            "description": "Multiple including json"
          }
        }
      },
      "patch": {
        "responses": {
          "200": {
            "description": "Fallback to valid global"
          }
        }
      },
      "delete": {
        "produces": [
          "application/json",
          "text/plain"
        ],
        "responses": {
          "200": {
            "description": "Mixed types valid"
          }
        }
      }
    }
  }
};