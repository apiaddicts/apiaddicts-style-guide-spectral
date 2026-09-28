module.exports = {
  "openapi": "3.0.0",
  "info": {
    "version": "1.0.0",
    "title": "OAR043 ok ref parameter"
  },
  "paths": {
    "/orders": {
      "get": {
        "parameters": [
          { "$ref": "#/components/parameters/Status" }
        ],
        "responses": {
          "200": { "description": "OK" }
        }
      }
    }
  },
  "components": {
    "parameters": {
      "Status": {
        "name": "status",
        "in": "query",
        "schema": { "type": "string" }
      }
    }
  }
};
