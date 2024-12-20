module.exports = {
  "openapi" : "3.0.0",
  "info" : {
    "version" : "1.0.0",
    "title" : "Swagger Petstore"
  },
  "paths" : {
    "/pets/{id}" : {
      "get" : {
        "parameters" : [ {
          "name" : "id",
          "in" : "path",
          "required" : true,
          "schema" : {
            "type" : "string"
          }
        } ],
        "responses" : {
          "200" : {
            "description" : "Result",
          },
          "404" : {
            "description" : "Not Found",
          }
        }
      }
    },
    "/pets" : {
      "get" : {
        "responses" : {
          "200" : {
            "description" : "Result",
          }
        }
      }
    }
  }
}