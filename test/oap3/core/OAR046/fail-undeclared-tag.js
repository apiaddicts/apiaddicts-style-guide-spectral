module.exports = {
  "openapi" : "3.0.1",
  "tags" : [ {
    "name" : "used-tag",
    "description" : "a tag referenced in the operations"
  } ],
  "info" : {
    "version" : "1.0.0",
    "title" : "Swagger Petstore"
  },
  "paths" : {
    "/pets" : {
      "get" : {
        "tags" : [ "other-tag" ],
        "responses" : { }
      }
    },
    "/pets/{petId}" : {
      "get" : {
        "parameters" : [ {
          "name" : "petId",
          "in" : "path",
          "required" : true,
          "schema" : {
            "type" : "string"
          }
        } ],
        "responses" : { }
      }
    }
  }
};
