module.exports = {
    "openapi": "3.0.0",
    "info": {
        "version": "1.0.0",
        "title": "Swagger Petstore"
    },
    "x-wso2-security": {
        "apim": {
            "x-wso2-scopes": [
                {
                    "name": "read",
                    "roles": ["READ_ROLE"],
                    "key": "read",
                    "description": "Allows users to read data"
                }
            ]
        }
    },
    "servers": [
        {
            "url": "https://petstore.swagger.io/v1"
        }
    ],
    "paths": {
        "/pets": {}
    }
};
  