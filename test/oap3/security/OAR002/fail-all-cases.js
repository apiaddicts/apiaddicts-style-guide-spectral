module.exports = {
    "openapi": "3.0.0",
    "info": {
        "version": "1.0.0",
        "title": "Swagger Petstore"
    },
    "x-wso2-security": {
        "apim": {
            "x-wso2-scopes": [
                { "name": "read", "roles": "ROLE_READ" },
                { "name": "write", "key": "write" },
                { "key": "view", "roles": "ROLE_VIEW" },
                { "name": "read2", "roles": "ROLE_READ_2", "key": null },
                { "name": "write2", "key": "write2", "roles": null },
                { "key": "view2", "roles": "ROLE_VIEW_2", "name": null }
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
