module.exports = {
    "swagger": "2.0",
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
                "x-aut-type": "Application & Application User"
            }
        }
    }
};