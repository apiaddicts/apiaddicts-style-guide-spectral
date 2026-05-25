module.exports = {
  "swagger": "2.0",
  "info": {
    "version": "1.0.0",
    "title": "OAR043 ok"
  },
  "paths": {
    "/orders": {
      "get": {
        "parameters": [
          {
            "name": "status",
            "in": "query",
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
