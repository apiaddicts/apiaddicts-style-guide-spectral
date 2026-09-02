module.exports = {
    "openapi": "3.0.0",
    "info": {
        "version": "1.0.0",
        "title": "Swagger Petstore"
    },
    "x-wso2-security": {
        "apim": {
            "x-wso2-scopes": [
                { "name": "read3", "key": "read3", "roles": [] },
                { "name": "read4", "key": "read4", "roles": {} },
                { "name": [], "key": "view3", "roles": "ROLE_VIEW_3" },
                { "name": "view4", "key": {}, "roles": "ROLE_VIEW_4" }
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
