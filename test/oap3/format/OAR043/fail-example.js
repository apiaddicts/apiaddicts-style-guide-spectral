// OAR043/fail-example.js
module.exports = {
    "openapi": "3.0.1",
    "info": {
        "version": "1.0.0",
        "title": "Ejemplo de API"
    },

    // Línea vacía antes de paths
    "paths": {
        "/clientes": {
            "get": {
                "summary": "Obtención de una colección de clientes",
                "description": "Permite obtener una colección de clientes.",
                "responses": {
                    "200": {
                        "description": "OK"
                    }
                }
            }
        }
    }
};