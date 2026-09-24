module.exports = {
    "openapi": "3.1.0",
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
            "$ref": "#/components/pathItems/SharedPet"
        }
    },
    "components": {
        "pathItems": {
            "SharedPet": {
                "get": {
                    "x-scope": "read"
                }
            }
        }
    }
};
