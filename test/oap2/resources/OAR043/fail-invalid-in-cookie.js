module.exports = {
  "swagger": "2.0",
  "info": {
    "version": "1.0.0",
    "title": "OAR043 invalid in cookie"
  },
  "paths": {
    "/orders": {
      "get": {
        "parameters": [
          {
            "name": "session",
            "in": "cookie",
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
