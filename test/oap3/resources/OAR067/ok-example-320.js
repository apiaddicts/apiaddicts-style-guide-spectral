module.exports = {
  openapi: '3.2.0',
  $self: 'https://api.media.example.com/streaming/openapi.yaml',
  info: {
    title: 'Media Streaming API',
    summary: 'Catalog search, playback sessions and live events.',
    version: '1.0.0',
  },
  servers: [
    {
      url: 'https://api.media.example.com/streaming/v1',
    },
  ],
  paths: {
    '/titles': {
      query: {
        operationId: 'searchTitles',
        parameters: [
          {
            name: 'filters',
            in: 'querystring',
            content: {
              'application/x-www-form-urlencoded': {
                schema: {
                  type: 'object',
                  properties: {
                    release_year: {
                      type: 'integer',
                    },
                  },
                },
              },
            },
          },
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  searchText: {
                    type: 'string',
                  },
                  genreIds: {
                    type: 'array',
                    items: {
                      type: 'string',
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            summary: 'Matching titles',
            description: 'Matching titles, streamed one per line.',
            content: {
              'application/jsonl': {
                itemSchema: {
                  type: 'object',
                  properties: {
                    titleId: {
                      type: 'string',
                    },
                    matchScore: {
                      type: 'number',
                    },
                  },
                },
                itemEncoding: {
                  headers: {
                    'X-Item-Meta': {
                      schema: {
                        type: 'object',
                        properties: {
                          item_meta: {
                            type: 'string',
                          },
                        },
                      },
                    },
                  },
                },
              },
              'application/json': {
                $ref: '#/components/mediaTypes/TitlePage',
              },
            },
          },
        },
      },
      additionalOperations: {
        PURGE: {
          responses: {
            202: {
              description: 'Purge accepted',
              content: {
                'application/json': {
                  schema: {
                    $ref: 'https://api.media.example.com/streaming/openapi.yaml#/components/schemas/PurgeJob',
                  },
                },
              },
            },
          },
        },
        COPY: {
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    targetCatalog: {
                      type: 'string',
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Ok',
            },
          },
        },
      },
    },
    '/sessions/{sessionId}/events': {
      get: {
        responses: {
          200: {
            description: 'Playback events as server-sent events',
            content: {
              'text/event-stream': {
                itemSchema: {
                  type: 'object',
                  properties: {
                    event: {
                      type: 'string',
                    },
                    data: {
                      $ref: '#/components/schemas/PlaybackEvent',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/channels': {
      $ref: '#/components/pathItems/Channels',
    },
    '/subscriptions': {
      post: {
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  callbackUrl: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Ok',
          },
        },
        callbacks: {
          onRenewal: {
            '{$request.body#/callbackUrl}': {
              query: {
                requestBody: {
                  content: {
                    'application/json': {
                      schema: {
                        type: 'object',
                        properties: {
                          renewalPeriod: {
                            type: 'string',
                          },
                        },
                      },
                    },
                  },
                },
                responses: {
                  200: {
                    description: 'Ok',
                  },
                },
              },
              additionalOperations: {
                NOTIFY: {
                  requestBody: {
                    content: {
                      'application/json': {
                        schema: {
                          type: 'object',
                          properties: {
                            notifyChannel: {
                              type: 'string',
                            },
                          },
                        },
                      },
                    },
                  },
                  responses: {
                    200: {
                      description: 'Ok',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  webhooks: {
    liveEventStarted: {
      post: {
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  startedAt: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Ok',
          },
        },
      },
      additionalOperations: {
        ANNOUNCE: {
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    announceText: {
                      type: 'string',
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Ok',
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      PurgeJob: {
        type: 'object',
        properties: {
          jobId: {
            type: 'string',
          },
          purgeScope: {
            type: 'string',
          },
        },
      },
      PlaybackEvent: {
        type: 'object',
        properties: {
          positionMs: {
            type: 'integer',
          },
          bitrateKbps: {
            type: 'integer',
          },
        },
      },
      Channel: {
        type: 'object',
        properties: {
          channelId: {
            type: ['string', 'null'],
          },
          channelName: {
            type: 'string',
          },
        },
      },
    },
    mediaTypes: {
      TitlePage: {
        schema: {
          type: 'object',
          properties: {
            items: {
              type: 'array',
              items: {
                type: 'object',
              },
            },
            totalCount: {
              type: 'integer',
            },
          },
        },
        prefixEncoding: [
          {
            headers: {
              'X-Part': {
                schema: {
                  type: 'object',
                  properties: {
                    part_meta: {
                      type: 'string',
                    },
                  },
                },
              },
            },
          },
        ],
      },
      UnusedMedia: {
        schema: {
          type: 'object',
          properties: {
            unused_media_field: {
              type: 'string',
            },
          },
        },
      },
    },
    pathItems: {
      Channels: {
        get: {
          responses: {
            200: {
              description: 'Channels',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/Channel',
                    },
                  },
                },
              },
            },
          },
        },
        query: {
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    channelFilter: {
                      type: 'string',
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Ok',
            },
          },
        },
      },
    },
  },
};
