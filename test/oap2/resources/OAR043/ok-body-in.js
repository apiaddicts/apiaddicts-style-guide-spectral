module.exports = {
  "swagger": "2.0",
  "info": {
    "version": "1.0.0",
    "title": "OAR043 ok body in"
  },
  "paths": {
    "/orders": {
      "post": {
        "parameters": [
          {
            "name": "order",
            "in": "body",
            "schema": { "type": "object" }
          }
        ],
        "responses": {
          "200": { "description": "OK" }
        }
      }
    }
  }
};
