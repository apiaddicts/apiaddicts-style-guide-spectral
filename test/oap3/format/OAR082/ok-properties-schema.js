module.exports = {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "Swagger Petstore"
  },
  paths: {
    "/pets": {
      post: {
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  without: {
                    type: "string"
                  },
                  date: {
                    type: "string",
                    format: "date"
                  },
                  "date-time": {
                    type: "string",
                    format: "date-time"
                  },
                  password: {
                    type: "string",
                    format: "password"
                  },
                  file: {
                    type: "string",
                    format: "binary"
                  },
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: "Ok",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    id: {
                      type: "integer"
                    },
                    file: {
                      type: "string",
                      format: "binary"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/pets/{petId}": {
      get: {
        responses: {
          200: {
            description: "Ok",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: {
                      type: "object",
                      properties: {
                        image: {
                          type: "string",
                          format: "binary"
                        }
                      }
                    },
                    payload: {
                      type: "object"
                    }
                  },
                  required: ["status", "payload"]
                }
              }
            }
          }
        }
      }
    }
  }
};
