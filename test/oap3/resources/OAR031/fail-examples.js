module.exports = {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "Swagger Petstore"
  },
  paths: {
    "/pets": {
      get: {
        responses: {
          206: {
            description: "Pet list",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/pets"
                }
              }
            }
          }
        }
      }
    },
    "/pets/{id}": {
      parameters: [
        {
          in: "query",
          name: "$init",
          schema: {
            type: "integer"
          }
        }
      ],
      get: {
        parameters: [
          {
            $ref: "#/components/parameters/id"
          }
        ],
        responses: {
          200: {
            description: "One pet",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/pet"
                }
              }
            }
          }
        }
      }
    }
  },
  components: {
    parameters: {
      id: {
        in: "path",
        name: "id",
        schema: {
          type: "integer",
          format: "int64",
          maxLength: 22
        },
        description: "Identificador del tipo de centro a obtener, actualizar o eliminar.",
        required: true
      }
    },
    schemas: {
      pet: {
        type: "object",
        properties: {
          name: {
            type: "string"
          },
          type: {
            type: "string"
          }
        }
      },
      pets: {
        type: "object",
        properties: {
          size: {
            type: "integer"
          },
          pets: {
            type: "array",
            items: {
              $ref: "#/components/schemas/pet"
            }
          }
        }
      }
    },
    responses: {
      server_error_response: {
        description: "Default error response",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                error: {
                  type: "string"
                }
              }
            }
          }
        }
      }
    }
  }
};