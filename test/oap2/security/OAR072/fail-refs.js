module.exports = {
  swagger: '2.0',
  info: { title: 'Document Vault API', version: '2.1.0' },
  host: 'api.vault.example.com',
  basePath: '/v2',
  schemes: ['https'],
  produces: ['application/json'],
  paths: {
    '/folders': {
      get: {
        operationId: 'listFolders',
        responses: {
          200: { description: 'Folders', schema: { type: 'array', items: { $ref: '#/definitions/Folder' } } },
          400: { $ref: '#/responses/BadRequest' },
          401: { $ref: '#/responses/BadRequest' },
        },
      },
      post: {
        operationId: 'createFolder',
        parameters: [{ name: 'body', in: 'body', schema: { $ref: '#/definitions/Folder' } }],
        responses: {
          201: { description: 'Created', schema: { $ref: '#/definitions/Folder' } },
          409: { description: 'Folder tree conflict', schema: { $ref: '#/definitions/TreeNode' } },
        },
      },
    },
    '/folders/{folderId}': {
      parameters: [{ name: 'folderId', in: 'path', required: true, type: 'string' }],
      get: {
        operationId: 'getFolder',
        responses: {
          200: { description: 'Folder', schema: { $ref: '#/definitions/Folder' } },
          404: { description: 'Folder not found', schema: { $ref: '#/definitions/NotFoundAlias' } },
          410: { description: 'Folder archived', schema: { $ref: '#/definitions/Envelope/properties/error' } },
        },
      },
    },
    '/folders/{folderId}/documents': { $ref: '#/x-path-templates/Documents' },
    '/folders/{folderId}/shares': {
      parameters: [{ name: 'folderId', in: 'path', required: true, type: 'string' }],
      post: {
        operationId: 'shareFolder',
        responses: {
          201: { description: 'Shared', schema: { $ref: '#/definitions/Folder' } },
          400: { description: 'Springfox generic wrapper', schema: { $ref: '#/definitions/ResponseEntity«ErrorDTO»' } },
          403: { description: 'Name with spaces', schema: { $ref: '#/definitions/Share Error' } },
          500: { description: 'Property defined by reference', schema: { type: 'object', properties: { stackTrace: { $ref: '#/definitions/StackFrames' } } } },
        },
      },
    },
  },
  'x-path-templates': {
    Documents: {
      parameters: [{ name: 'folderId', in: 'path', required: true, type: 'string' }],
      get: {
        operationId: 'listDocuments',
        responses: {
          200: { description: 'Documents', schema: { type: 'array', items: { type: 'string' } } },
          500: { description: 'Storage failure', schema: { type: 'object', properties: { storageStackTrace: { type: 'string' } } } },
        },
      },
    },
  },
  responses: {
    BadRequest: { description: 'Bad request', schema: { $ref: '#/definitions/Problem' } },
  },
  definitions: {
    Folder: { type: 'object', properties: { id: { type: 'string' }, name: { type: 'string' } } },
    Problem: { allOf: [{ $ref: '#/definitions/ProblemBase' }, { type: 'object', properties: { title: { type: 'string' } } }] },
    ProblemBase: { type: 'object', properties: { status: { type: 'integer' }, stackTrace: { type: 'string' } } },
    TreeNode: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        children: { type: 'array', items: { $ref: '#/definitions/TreeNode' } },
        nodeStackTrace: { type: 'string' },
      },
    },
    'ResponseEntity«ErrorDTO»': { type: 'object', properties: { body: { type: 'object' }, exceptionStackTrace: { type: 'string' } } },
    'Share Error': { type: 'object', properties: { reason: { type: 'string' }, STACK_TRACE: { type: 'string' } } },
    StackFrames: { type: 'array', items: { type: 'string' } },
    NotFoundAlias: { $ref: '#/definitions/NotFoundCore' },
    NotFoundCore: { type: 'object', properties: { message: { type: 'string' }, stack_trace: { type: 'string' } } },
    Envelope: {
      type: 'object',
      properties: {
        data: { type: 'object' },
        error: { type: 'object', properties: { code: { type: 'string' }, 'Stack-Trace': { type: 'string' } } },
      },
    },
  },
};
