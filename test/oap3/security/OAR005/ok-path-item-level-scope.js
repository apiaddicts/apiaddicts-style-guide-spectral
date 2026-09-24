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
                    "name": "CATALOG_SC_READ",
                    "key": "read",
                    "roles": ["READ_ROLE"]
                }
            ]
        }
    },
    "paths": {
        "/pets": {
            "x-scope": "undeclared_at_path_item_level",
            "get": {
                "x-scope": "CATALOG_SC_READ"
            }
        }
    }
};
