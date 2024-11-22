module.exports = {
  openapi: "3.0.1",
  info: {
    version: "1.0.0",
    title: "Swagger Petstore"
  },
  paths: {
    "/pets": {
      post: {
        summary: "create a pet",
        description: "create a pet",
        responses: {
          default: {
            description: "the default response"
          }
        }
      },
      get: {
        summary: "List all pets",
        description: "list all pets",
        responses: {
          default: {
            description: "the default response"
          }
        }
      }
    }
  }
};