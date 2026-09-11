module.exports = {
    "openapi": "3.2.0",
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
            "query": {
                "x-scope": "read",
                "x-auth-type": "Application"
            },
            "additionalOperations": {
                "PURGE": {
                    "x-scope": "read",
                    "x-auth-type": "Application"
                }
            }
        }
    }
};
