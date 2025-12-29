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
              "x-api-key": {
                "type": "string"
              },
              "x-trace-id": {
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
