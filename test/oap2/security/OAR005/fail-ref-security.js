module.exports = {
    "swagger": "2.0",
    "info": {
        "version": "1.0.0",
        "title": "Swagger Petstore"
    },
    "x-wso2-security": {
        "$ref": "#/x-wso2-definitions/security"
    },
    "x-wso2-definitions": {
        "security": {
            "apim": {
                "x-wso2-scopes": [
                    {
                        "name": "CATALOG_SC_READ",
                        "key": "read",
                        "roles": ["READ_ROLE"]
                    }
                ]
            }
        }
    },
    "paths": {
        "/pets": {
            "get": {
                "x-scope": "CATALOG_SC_READ"
            },
            "post": {
                "x-scope": "undeclared_scope"
            }
        }
    }
};
