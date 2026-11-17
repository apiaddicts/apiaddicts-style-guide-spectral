module.exports = {
  openapi: '3.0.3',
  info: {
    title: 'AgisFinancialSolutions',
    description: 'Valuation re-study of network solutions for the CRM.',
    version: '1.4.0',
  },
  servers: [{ url: 'https://api.agis.example.com/financial-solutions/v1' }],
  paths: {
    '/assessments/{assessment_id}/cheapest-solutions': {
      get: {
        operationId: 'getCheapestSolution',
        parameters: [{ name: 'assessment_id', in: 'path', required: true, schema: { type: 'integer', format: 'int64' } }],
        responses: {
          200: {
            description: 'OK',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/cheapestSolution' } } },
          },
          404: {
            description: 'Assessment not found',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/errorResponse' } } },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      redEnum: {
        type: 'string',
        description: 'Network of the winning solution.',
        enum: ['FTTH', 'HFC', 'RADIO'],
        example: 'FTTH',
      },
      proveedorUltimaMillaEnum: {
        type: 'integer',
        format: 'int32',
        nullable: true,
        enum: [219010010, 219010011, null],
        example: 1530,
      },
      coberturaOrlaEnum: {
        type: 'integer',
        format: 'int32',
        nullable: true,
        description: 'CRM ORLA coverage of the chosen ORLA point.',
        enum: [219010001, 219010002, null],
        example: 219010001,
      },
      cheapestSolution: {
        type: 'object',
        description: 'CRM fields of the most economical solution of the re-studied valuation. All eight attributes are always present.',
        required: ['red', 'nearNet', 'capex', 'opex', 'proveedorUltimaMilla', 'zonaORLA', 'coberturaORLA', 'gvalAQS'],
        properties: {
          red: { $ref: '#/components/schemas/redEnum' },
          nearNet: { type: 'boolean', description: 'Whether the Near-Net option was enabled.', example: false },
          capex: { type: 'number', format: 'double', description: 'Total CAPEX of the winning solution, in euros.', example: 440.0 },
          opex: { type: 'number', format: 'double', description: 'Total OPEX of the winning solution, in euros.', example: 75.0 },
          proveedorUltimaMilla: { $ref: '#/components/schemas/proveedorUltimaMillaEnum' },
          zonaORLA: {
            type: 'integer',
            format: 'int32',
            nullable: true,
            description: 'CRM ORLA zone of the chosen ORLA point.',
            example: 219010002,
          },
          coberturaORLA: { $ref: '#/components/schemas/coberturaOrlaEnum' },
          gvalAQS: { type: 'integer', format: 'int64', description: 'AQS id of the valuation the response is based on.', example: 140284 },
        },
        example: {
          red: 'FTTH',
          nearNet: false,
          capex: 440.0,
          opex: 75.0,
          proveedorUltimaMilla: 1530,
          zonaORLA: 219010002,
          coberturaORLA: 219010001,
          gvalAQS: 140284,
        },
      },
      errorResponse: {
        type: 'object',
        properties: {
          code: { type: 'string' },
          message: { type: 'string' },
        },
      },
    },
  },
};
