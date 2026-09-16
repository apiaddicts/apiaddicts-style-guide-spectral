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
                    "name": "USER_SC_READ",
                    "key": "read",
                    "roles": ["READ_ROLE"]
                },
                {
                    "name": "USER_SC_WRITE",
                    "key": "write",
                    "roles": ["WRITE_ROLE"]
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
        "/pets": {
            "get": {
                "x-scope": "USER_SC_READ"
            }
        }
    }
};
