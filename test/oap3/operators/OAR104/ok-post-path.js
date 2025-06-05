module.exports = {
  "openapi": "3.0.1",
  "info": {
    "title": "Swagger Petstore",
    "version": "1.0.0"
  },
  "servers": [
    {
      "url": "/"
    }
  ],
  "paths": {
    "/resources/{r_id}/other": {
      "post": {
        "responses": {
          "200": {
            "description": "Ok"
          }
        }
      }
    }
  }
};
