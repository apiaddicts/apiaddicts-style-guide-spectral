module.exports = {
    "openapi": "3.0.0",
    "info": {
        "title": "Sample API",
        "version": "1.0.0"
    },
    "paths": {
        "/sample": {
            "post": {
                "requestBody": {
                    "$ref": "#/components/requestBodies/PetDetailsBody"
                },
                "responses": {
                    "201": {
                        "description": "Created"
                    }
                }
            }
        }
    },
    "components": {
        "requestBodies": {
            "PetDetailsBody": {
                "content": {
                    "application/json": {
                        "schema": {
                            "type": "object",
                            "properties": {
                                "name": {
                                    "type": "string"
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};
