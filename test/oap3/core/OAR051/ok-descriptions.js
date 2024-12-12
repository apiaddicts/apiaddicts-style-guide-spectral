module.exports ={
  "openapi" : "3.0.1",
  "info" : {
    "version" : "1.0.0",
    "title" : "Swagger Petstore"
  },
  "paths" : {
    "/pets" : {
      "post" : {
        "summary" : "create a pet",
        "description" : "Create a new pet. The pet type is assigned a new unique ID, and can then be referenced in other operations.",
        "responses" : {
          "default" : {
            "description" : "the default response"
          }
        }
      },
      "get" : {
        "summary" : "List all pets",
        "description" : "List all pets from the system that the user has access to",
        "responses" : {
          "default" : {
            "description" : "the default response"
          }
        }
      }
    },
    "x-apigen-binding" : {
      model: "Greeting",
    }
  }
}