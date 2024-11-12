module.exports = {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "Swagger Petstore"
  },
  paths: {
    "/pets": {
      post: {
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
                        code: {
                          type: "integer"
                        },
                        description: {
                          type: "string"
                        }
                      },
                      required: ["code"]
                    },
                    payload: {
                      type: "object",
                      properties: {
                        id: {
                          type: "integer"
                        },
                        name: {
                          type: "string"
                        }
                      }
                    }
                  },
                  required: ["status", "payload"]
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
                        code: {
                          type: "integer"
                        },
                        description: {
                          type: "string"
                        }
                      },
                      required: ["code"]
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
