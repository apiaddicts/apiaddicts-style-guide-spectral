module.exports = {
  "swagger": "2.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore"
  },
  "host": "petstore.swagger.io",
  "basePath": "/v2",
  "paths": {
    "/users": {
      "post": {
        "parameters": [
          {
            "in": "body",
            "name": "body",
            "required": true,
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
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "type": "object",
              "properties": {
                "userId": { "type": "string" },
                "createdAt": { "type": "string" },
                "fullName": { "type": "string" },
                "homeAddress": {
                  "type": "object",
                  "properties": {
                    "streetName": { "type": "string" }
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