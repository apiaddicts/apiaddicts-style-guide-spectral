module.exports = {
  "openapi": "3.0.1",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore"
  },
  "paths": {
    "/pets": {
      "post": {
        "requestBody": {
          "content": {
            "application/json": {},
            "text/plain; charset=utf-8": {},
            "text/plain;charset=utf-8": {},
            "multipart/form-data": {},
            "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxk": {},
            "multipart/form-data; boundary=\"----abc 123\"": {},
            "application/json; charset=utf-8; boundary=xyz": {},
            "application/vnd.ms-excel": {},
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": {},
            "application/ld+json": {},
            "image/*": {},
            "*/*": {}
          }
        },
        "responses": {
          "200": {
            "description": "some operation",
            "content": {
              "application/json": {},
              "text/csv": {},
              "image/png": {},
              "application/vnd.ms-excel": {},
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": {},
              "application/vnd.github+json": {},
              "text/plain; charset=utf-8": {}
            }
          }
        },
        "parameters": [
          {
            "name": "someParam",
            "in": "query",
            "content": {
              "text/*": {}
            }
          }
        ]
      },
      "get": {
        "responses": {
          "200": {
            "description": "some operation"
          }
        }
      }
    }
  }
};
