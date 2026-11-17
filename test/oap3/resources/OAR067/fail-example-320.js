const SELF = 'https://api.media.example.com/streaming/openapi.yaml';
const json = (schema) => ({ 'application/json': { schema } });
const ok = { 200: { description: 'Ok' } };

module.exports = {
  openapi: '3.2.0',
  $self: SELF,
  info: { title: 'Media Streaming API', summary: 'Catalog search, playback sessions and live events.', version: '1.0.0' },
  servers: [{ url: 'https://api.media.example.com/streaming/v1' }],
  paths: {
    '/titles': {
      query: {
        operationId: 'searchTitles',
        parameters: [
          {
            name: 'filters',
            in: 'querystring',
            content: { 'application/x-www-form-urlencoded': { schema: { type: 'object', properties: { release_year: { type: 'integer' } } } } },
          },
        ],
        requestBody: { content: json({ type: 'object', properties: { search_text: { type: 'string' }, genreIds: { type: 'array', items: { type: 'string' } } } }) },
        responses: {
          200: {
            summary: 'Matching titles',
            description: 'Matching titles, streamed one per line.',
            content: {
              'application/jsonl': {
                itemSchema: { type: 'object', properties: { titleId: { type: 'string' }, match_score: { type: 'number' } } },
                itemEncoding: { headers: { 'X-Item-Meta': { schema: { type: 'object', properties: { item_meta: { type: 'string' } } } } } },
              },
              'application/json': { $ref: '#/components/mediaTypes/TitlePage' },
            },
          },
        },
      },
      additionalOperations: {
        PURGE: {
          responses: { 202: { description: 'Purge accepted', content: json({ $ref: `${SELF}#/components/schemas/PurgeJob` }) } },
        },
        COPY: {
          requestBody: { content: json({ type: 'object', properties: { target_catalog: { type: 'string' } } }) },
          responses: ok,
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
                  properties: { event: { type: 'string' }, data: { $ref: '#/components/schemas/PlaybackEvent' } },
                },
              },
            },
          },
        },
      },
    },
    '/channels': { $ref: '#/components/pathItems/Channels' },
    '/subscriptions': {
      post: {
        requestBody: { content: json({ type: 'object', properties: { callbackUrl: { type: 'string' } } }) },
        responses: ok,
        callbacks: {
          onRenewal: {
            '{$request.body#/callbackUrl}': {
              query: { requestBody: { content: json({ type: 'object', properties: { renewal_period: { type: 'string' } } }) }, responses: ok },
              additionalOperations: {
                NOTIFY: { requestBody: { content: json({ type: 'object', properties: { notify_channel: { type: 'string' } } }) }, responses: ok },
              },
            },
          },
        },
      },
    },
  },
  webhooks: {
    liveEventStarted: {
      post: { requestBody: { content: json({ type: 'object', properties: { started_at: { type: 'string' } } }) }, responses: ok },
      additionalOperations: {
        ANNOUNCE: { requestBody: { content: json({ type: 'object', properties: { announce_text: { type: 'string' } } }) }, responses: ok },
      },
    },
  },
  components: {
    schemas: {
      PurgeJob: { type: 'object', properties: { jobId: { type: 'string' }, purge_scope: { type: 'string' } } },
      PlaybackEvent: { type: 'object', properties: { position_ms: { type: 'integer' }, bitrateKbps: { type: 'integer' } } },
      Channel: { type: 'object', properties: { channelId: { type: ['string', 'null'] }, channel_name: { type: 'string' } } },
    },
    mediaTypes: {
      TitlePage: {
        schema: { type: 'object', properties: { items: { type: 'array', items: { type: 'object' } }, total_count: { type: 'integer' } } },
        prefixEncoding: [{ headers: { 'X-Part': { schema: { type: 'object', properties: { part_meta: { type: 'string' } } } } } }],
      },
      UnusedMedia: { schema: { type: 'object', properties: { unused_media_field: { type: 'string' } } } },
    },
    pathItems: {
      Channels: {
        get: { responses: { 200: { description: 'Channels', content: json({ type: 'array', items: { $ref: '#/components/schemas/Channel' } }) } } },
        query: { requestBody: { content: json({ type: 'object', properties: { channel_filter: { type: 'string' } } }) }, responses: ok },
      },
    },
  },
};
