module.exports = {
  "openapi" : "3.0.0",
  "info" : {
    "version" : "1.0.0",
    "title" : "Swagger Petstore"
  },
  "servers" : [
    {
      // # Noncompliant {{OAR001: Protocol https in server url is mandatory}}
      "url": "http://petstore.swagger.io/v1"
    }
  ],
  "paths" : {
    "/pets" : { }
  }
};
