module.exports = {
  swagger: '2.0',
  info: {
    title: 'AgisFinancialSolutions',
    description: 'Valuation re-study of network solutions for the CRM.',
    version: '1.4.0',
  },
  host: 'api.agis.example.com',
  basePath: '/financial-solutions/v1',
  schemes: ['https'],
  produces: ['application/json'],
  paths: {
    '/assessments/{assessment_id}/cheapest-solutions': {
      get: {
        operationId: 'getCheapestSolution',
        parameters: [
          {
            name: 'assessment_id',
            in: 'path',
            required: true,
            type: 'integer',
            format: 'int64',
          },
        ],
        responses: {
          200: {
            description: 'OK',
            schema: {
              $ref: '#/definitions/cheapestSolution',
            },
          },
        },
      },
    },
  },
  definitions: {
    redEnum: {
      type: 'string',
      enum: ['FTTH', 'HFC', 'RADIO'],
    },
    proveedorUltimaMillaEnum: {
      type: 'integer',
      format: 'int32',
      'x-nullable': true,
      enum: [219010010, 219010011],
    },
    coberturaOrlaEnum: {
      type: 'integer',
      format: 'int32',
      'x-nullable': true,
      enum: [219010001, 219010002],
    },
    cheapestSolution: {
      type: 'object',
      required: ['red', 'nearNet', 'capex', 'opex', 'proveedorUltimaMilla', 'zonaOrla', 'coberturaOrla', 'gvalAqs'],
      properties: {
        red: {
          $ref: '#/definitions/redEnum',
        },
        nearNet: {
          type: 'boolean',
        },
        capex: {
          type: 'number',
          format: 'double',
        },
        opex: {
          type: 'number',
          format: 'double',
        },
        proveedorUltimaMilla: {
          $ref: '#/definitions/proveedorUltimaMillaEnum',
        },
        zonaOrla: {
          type: 'integer',
          format: 'int32',
          'x-nullable': true,
        },
        coberturaOrla: {
          $ref: '#/definitions/coberturaOrlaEnum',
        },
        gvalAqs: {
          type: 'integer',
          format: 'int64',
        },
      },
    },
  },
};
