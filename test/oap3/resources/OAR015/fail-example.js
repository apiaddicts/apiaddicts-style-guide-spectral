module.exports = {
  "openapi": "3.0.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore"
  },
  "paths": {
    "/level1/level2/level3/level4/level5/level6": {
      "get": {
        "responses": {
          "200": { "description": "OK" }
        }
      }
    },
    "/a/{p1}/b/{p2}/c/{p3}/d/{p4}/e/{p5}/f": {
      "get": {
        "responses": {
          "200": { "description": "fail: 6 literal segments (params excluded) > 5" }
        }
      }
    }
  }
};
