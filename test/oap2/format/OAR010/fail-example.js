module.exports = {
  "swagger": "2.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore"
  },
  "produces": [
    "application/xml"
  ],
  "paths": {
    "/invoices": {
      "get": {
        "responses": {
          "200": {
            "description": "No produces override"
          }
        }
      },
      "post": {
        "produces": [
          "text/plain"
        ],
        "responses": {
          "200": {
            "description": "Wrong produces at operation level"
          }
        }
      },
      "put": {
        "produces": [],
        "responses": {
          "200": {
            "description": "Empty produces"
          }
        }
      },
      "patch": {
        "responses": {
          "200": {
            "description": "Falls back to wrong global produces"
          }
        }
      },
      "delete": {
        "produces": [
          "application/xml",
          "text/html"
        ],
        "responses": {
          "200": {
            "description": "Multiple but missing json"
          }
        }
      }
    }
  }
};