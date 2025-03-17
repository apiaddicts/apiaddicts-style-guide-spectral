module.exports = {
    "openapi": "3.0.0",
    "info": {
        "title": "Sample API",
        "version": "1.0.0"
    },
    "paths": {
        "/sample": {
            "get": {
                "responses": {
                    "200": {
                        "$ref": "#/components/responses/SuccessResponse"  // Cumple la regla
                    }
                }
            }
        }
    },
    "components": {
        "responses": {
            "SuccessResponse": {
                "description": "Successful response"
            }
        }
    }
};
