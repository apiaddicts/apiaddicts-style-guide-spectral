module.exports = {
  "openapi": "3.0.0",
  "info": {
    "title": "Swagger Petstore",
    "version": "1.0"
  },
  "paths": {
    "/resources": {
      "get": {
        "responses": {
          "200": { "description": "Ok" }
        }
      },
      "post": {
        "responses": {
          "201": { "description": "Created" }
        }
      }
    },

    "/resources/{id}": {
      "get": {
        "responses": {
          "200": { "description": "Ok" }
        }
      },
      "put": {
        "responses": {
          "200": { "description": "Updated" }
        }
      },
      "patch": {
        "responses": {
          "200": { "description": "Patched" }
        }
      },
      "delete": {
        "responses": {
          "204": { "description": "Deleted" }
        }
      }
    },

    "/resources/me": {
      "get": {
        "responses": {
          "200": { "description": "Ok" }
        }
      },
      "put": {
        "responses": {
          "200": { "description": "Updated" }
        }
      }
    },

    "/resources/{id}/children": {
      "get": {
        "responses": {
          "200": { "description": "Ok" }
        }
      },
      "post": {
        "responses": {
          "201": { "description": "Created" }
        }
      }
    },

    "/resources/{id}/children/{childId}": {
      "get": {
        "responses": {
          "200": { "description": "Ok" }
        }
      },
      "put": {
        "responses": {
          "200": { "description": "Updated" }
        }
      },
      "delete": {
        "responses": {
          "204": { "description": "Deleted" }
        }
      }
    },

    "/resources/{id}/children/{childId}/details": {
      "get": {
        "responses": {
          "200": { "description": "Ok" }
        }
      }
    },

    "/resources/get": {
      "post": {
        "responses": {
          "200": { "description": "Action GET" }
        }
      }
    },

    "/resources/{id}/children/get": {
      "post": {
        "responses": {
          "200": { "description": "Action GET" }
        }
      }
    },

    "/resources/{id}/children/delete": {
      "post": {
        "responses": {
          "200": { "description": "Action DELETE" }
        }
      }
    }
  }
};