module.exports = {
  "openapi": "3.1.0",
  "info": {
    "version": "1.0.0",
    "title": "OAR043 fail path items"
  },
  "paths": {},
  "components": {
    "pathItems": {
      "SharedOrders": {
        "get": {
          "parameters": [
            {
              "name": "status",
              "in": "headers",
              "schema": { "type": "string" }
            }
          ],
          "responses": {
            "200": { "description": "OK" }
          }
        }
      }
    }
  }
};
