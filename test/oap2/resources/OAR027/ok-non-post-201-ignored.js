module.exports = {
  "swagger" : "2.0",
  "info" : {
    "version" : "1.0.0",
    "title" : "Swagger Petstore"
  },
  "paths" : {
    "/pets/{petId}/snapshot" : {
      "get" : {
        "responses" : {
          "201" : {
            "description" : "A freshly generated snapshot was created and returned"
          }
        }
      }
    }
  }
}
