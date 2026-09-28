module.exports = {
    "swagger": "2.0",
    "info": {
        "version": "1.0.0",
        "title": "Swagger Petstore"
    },
    "x-wso2-security": {
        "apim": {
            "x-wso2-scopes": {
                "read": {
                    "name": "CATALOG_SC_READ",
                    "key": "read",
                    "roles": ["READ_ROLE"]
                }
            }
        }
    },
    "paths": {
        "/pets": {
            "get": {
                "x-scope": "read"
            }
        }
    }
};
