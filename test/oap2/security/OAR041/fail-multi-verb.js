module.exports = {
    "swagger": "2.0",
    "info": {
        "version": "1.0.0",
        "title": "Swagger Petstore"
    },
    "x-wso2-security": {
        "apim": {
            "x-wso2-scopes": [
                {
                    "name": "read",
                    "key": "read",
                    "roles": "READ_ROLE",
                    "description": "Allows users to view records"
                },
                {
                    "name": "write",
                    "key": "write",
                    "roles": "WRITE_ROLE",
                    "description": "Allows users to modify records"
                }
            ]
        }
    },
    "paths": {
        "/pets": {
            "get": {
                "x-scope": "read",
                "x-auth-type": "Application"
            },
            "post": {
                "x-scope": "write"
            },
            "delete": {
                "x-scope": "write"
            }
        }
    }
};
