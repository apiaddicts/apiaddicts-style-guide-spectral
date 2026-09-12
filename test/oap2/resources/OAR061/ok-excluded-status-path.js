module.exports = {
  "swagger": "2.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore Excluded Status Path"
  },
  "paths": {
    "/status": {
      "get": {
        "responses": {
          "500": { "description": "Server error" }
        }
      }
    }
  }
};
