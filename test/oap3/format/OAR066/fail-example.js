module.exports = {
  "openapi": "3.0.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore"
  },
  "paths": {
    "/users": {
      "post": {
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "firstName": { "type": "string" },
                  "lastName": { "type": "string" },
                  "homeAddress": {
                    "type": "object",
                    "properties": {
                      "streetName": { "type": "string" },
                      "zipCode": { "type": "string" }
                    }
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "userId": { "type": "string" },
                    "createdAt": { "type": "string" },
                    "fullName": { "type": "string" },
                    "homeAddress": {
                      "type": "object",
                      "properties": {
                        "streetName": { "type": "string" },
                        "postalCode": { "type": "string" }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};