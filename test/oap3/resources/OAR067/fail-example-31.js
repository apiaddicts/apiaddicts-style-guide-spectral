const json = (schema) => ({ 'application/json': { schema } });
const ok = { 200: { description: 'Ok' } };

module.exports = {
  openapi: '3.1.0',
  info: { title: 'Logistics Shipments API', summary: 'Shipments, parcels and carrier events.', version: '6.0.0' },
  servers: [{ url: 'https://api.logistics.example.com/shipments/v6' }],
  paths: {
    '/shipments': {
      post: {
        operationId: 'createShipment',
        requestBody: {
          content: json({
            $ref: '#/components/schemas/Shipment',
            description: 'Keywords next to $ref apply from OpenAPI 3.1.',
            properties: { sibling_note: { type: 'string' } },
          }),
        },
        responses: {
          201: {
            description: 'Created',
            content: json({
              type: ['object', 'null'],
              properties: {
                shipmentId: { type: 'string' },
                carrier_info: { $ref: '#/components/schemas/Carrier', description: 'Carrier chosen for the shipment.' },
                tracking: { oneOf: [{ $ref: '#/components/schemas/Tracking' }, { type: 'null' }] },
                labels: { type: ['array', 'null'], items: { type: 'object', properties: { label_url: { type: 'string', format: 'uri' } } } },
                legacy_code: false,
                any_extra: true,
              },
              examples: [{ shipmentId: 'S-1', example_key: 'only an example' }],
            }),
          },
        },
      },
    },
    '/shipments/{shipmentId}': { $ref: '#/components/pathItems/ShipmentItem' },
    '/parcels': {
      put: {
        requestBody: {
          content: json({
            type: 'object',
            properties: {
              parcelType: { type: 'string', enum: ['BOX', 'PALLET'] },
              dimensions: { $ref: '#/components/schemas/Parcel/$defs/Dimension' },
            },
            if: { properties: { parcelType: { const: 'PALLET' }, pallet_kind: { type: 'string' } } },
            then: { properties: { forklift_required: { type: 'boolean' } } },
            else: { properties: { hand_carry: { type: 'boolean' } } },
            patternProperties: { '^x_custom_.*$': { type: 'object', properties: { pattern_value: { type: 'string' } } } },
            dependentSchemas: { insurance: { properties: { insured_value: { type: 'number' } } } },
            unevaluatedProperties: { type: 'object', properties: { extra_field: { type: 'string' } } },
          }),
        },
        responses: {
          200: {
            description: 'Parcel route',
            content: json({
              type: 'array',
              prefixItems: [{ type: 'object', properties: { first_stop: { type: 'string' } } }, { type: 'string' }],
              contains: { type: 'object', properties: { hub_code: { type: 'string' } } },
            }),
          },
        },
      },
    },
  },
  webhooks: {
    shipmentDelivered: {
      post: {
        requestBody: { content: json({ type: 'object', properties: { delivered_at: { type: 'string', format: 'date-time' }, signedBy: { type: 'string' } } }) },
        responses: ok,
      },
    },
    shipmentDelayed: { $ref: '#/components/pathItems/DelayHook' },
  },
  components: {
    schemas: {
      Shipment: {
        type: 'object',
        required: ['origin_hub'],
        properties: { origin_hub: { type: 'string' }, destinationHub: { type: 'string' }, parcels: { type: 'array', items: { $ref: '#/components/schemas/Parcel' } } },
      },
      Parcel: {
        type: 'object',
        $defs: {
          Dimension: { type: 'object', properties: { unit_of_measure: { type: 'string' }, width: { type: 'number' } } },
          Unused: { type: 'object', properties: { defs_only: { type: 'string' } } },
        },
        properties: { parcelId: { type: 'string' }, gross_weight: { type: ['number', 'null'] } },
      },
      Carrier: { type: 'object', properties: { carrierCode: { type: 'string' }, scac_code: { type: 'string' } } },
      Tracking: { type: 'object', properties: { tracking_number: { type: 'string' } } },
      DelayEvent: { type: 'object', properties: { delay_minutes: { type: 'integer' } } },
    },
    pathItems: {
      ShipmentItem: {
        get: { responses: { 200: { description: 'Shipment', content: json({ $ref: '#/components/schemas/Shipment' }) } } },
        patch: { requestBody: { content: json({ type: 'object', properties: { patch_reason: { type: 'string' } } }) }, responses: ok },
      },
      DelayHook: { post: { requestBody: { content: json({ $ref: '#/components/schemas/DelayEvent' }) }, responses: ok } },
      UnusedItem: { post: { requestBody: { content: json({ type: 'object', properties: { unused_item_field: { type: 'string' } } }) }, responses: ok } },
    },
  },
};
