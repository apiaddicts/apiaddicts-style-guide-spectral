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
            "description": "GET is exempt in OAS2, even with a wrong global produces"
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
            "description": "DELETE is exempt in OAS2, even with produces missing json"
          }
        }
      }
    }
  }
};