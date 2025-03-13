module.exports = {
    "openapi": "3.0.1",
    "info": {
        "version": "1.0.0",
        "title": "Ejemplo de API"
    },
    "paths": {
        "/clientes": {
            "get": {
                "summary": "Obtención de una colección de clientes",
                "description": "| Permite obtener una colección de clientes. Por ejemplo: /usuarios o /expedientes. Puede admitir cabeceras, *query parameters* y el objeto $filter en el body. **Scope Oauth:** clientes_sc_consulta",
                "responses": {
                    "200": {
                        "description": "OK"
                    }
                }
            }
        }
    }
};
