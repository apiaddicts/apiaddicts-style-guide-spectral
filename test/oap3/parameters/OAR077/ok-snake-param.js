module.exports = {
  "openapi" : "3.0.0",
  "info" : {
    "version" : "1.0.0",
    "title" : "Swagger Petstore"
  },
  "paths" : {
    "/pets" : {
      "get" : {
        "parameters" : [ {
          "in" : "query",
          "name" : "other",
          "schema": {
            "type" : "array",
            "items" : {
              "type" : "string"
            }
          }
        }, {
          "in" : "query",
          "name" : "other_param",
          "schema": {
            "type" : "array",
            "items" : {
              "type" : "string"
            }
          }
        }, {
          "in" : "query",
          "name" : "$total",
          "schema": {
            "type" : "boolean",
          }
        } ],
        "responses" : {
          "200" : {
            "description" : "Ok"
          }
        }
      }
    }
  }
}