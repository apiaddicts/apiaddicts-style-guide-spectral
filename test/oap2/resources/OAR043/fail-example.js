module.exports = {
  "swagger": "2.0",
  "info": {
    "version": "1.0.0",
    "title": "OAR043 fail"
  },
  "paths": {
    "/orders": {
      "get": {
        "parameters": [
          {
            "name": "status",
            "in": "headers",
            "required": false,
            "type": "string"
          }
        ],
        "responses": {
          "200": { "description": "OK" }
        }
      }
    }
  }
};
