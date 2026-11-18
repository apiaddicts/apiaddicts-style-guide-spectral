module.exports = {
  openapi: '3.1.0',
  info: {
    title: 'Logistics Shipments API',
    summary: 'Shipments, parcels and carrier events.',
    version: '6.0.0',
  },
  servers: [
    {
      url: 'https://api.logistics.example.com/shipments/v6',
    },
  ],
  paths: {
    '/shipments': {
      post: {
        operationId: 'createShipment',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Shipment',
                description: 'Keywords next to $ref apply from OpenAPI 3.1.',
                properties: {
                  siblingNote: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Created',
            content: {
              'application/json': {
                schema: {
                  type: ['object', 'null'],
                  properties: {
                    shipmentId: {
                      type: 'string',
                    },
                    carrierInfo: {
                      $ref: '#/components/schemas/Carrier',
                      description: 'Carrier chosen for the shipment.',
                    },
                    tracking: {
                      oneOf: [
                        {
                          $ref: '#/components/schemas/Tracking',
                        },
                        {
                          type: 'null',
                        },
                      ],
                    },
                    labels: {
                      type: ['array', 'null'],
                      items: {
                        type: 'object',
                        properties: {
                          labelUrl: {
                            type: 'string',
                            format: 'uri',
                          },
                        },
                      },
                    },
                    legacy_code: false,
                    anyExtra: true,
                  },
                  examples: [
                    {
                      shipmentId: 'S-1',
                      example_key: 'only an example',
                    },
                  ],
                },
              },
            },
          },
        },
      },
    },
    '/shipments/{shipmentId}': {
      $ref: '#/components/pathItems/ShipmentItem',
    },
    '/parcels': {
      put: {
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  parcelType: {
                    type: 'string',
                    enum: ['BOX', 'PALLET'],
                  },
                  dimensions: {
                    $ref: '#/components/schemas/Parcel/$defs/Dimension',
                  },
                },
                if: {
                  properties: {
                    parcelType: {
                      const: 'PALLET',
                    },
                    palletKind: {
                      type: 'string',
                    },
                  },
                },
                then: {
                  properties: {
                    forkliftRequired: {
                      type: 'boolean',
                    },
                  },
                },
                else: {
                  properties: {
                    handCarry: {
                      type: 'boolean',
                    },
                  },
                },
                patternProperties: {
                  '^x_custom_.*$': {
                    type: 'object',
                    properties: {
                      patternValue: {
                        type: 'string',
                      },
                    },
                  },
                },
                dependentSchemas: {
                  insurance: {
                    properties: {
                      insuredValue: {
                        type: 'number',
                      },
                    },
                  },
                },
                unevaluatedProperties: {
                  type: 'object',
                  properties: {
                    extraField: {
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
            description: 'Parcel route',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  prefixItems: [
                    {
                      type: 'object',
                      properties: {
                        firstStop: {
                          type: 'string',
                        },
                      },
                    },
                    {
                      type: 'string',
                    },
                  ],
                  contains: {
                    type: 'object',
                    properties: {
                      hubCode: {
                        type: 'string',
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
  },
  webhooks: {
    shipmentDelivered: {
      post: {
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  deliveredAt: {
                    type: 'string',
                    format: 'date-time',
                  },
                  signedBy: {
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
    shipmentDelayed: {
      $ref: '#/components/pathItems/DelayHook',
    },
  },
  components: {
    schemas: {
      Shipment: {
        type: 'object',
        required: ['originHub'],
        properties: {
          originHub: {
            type: 'string',
          },
          destinationHub: {
            type: 'string',
          },
          parcels: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/Parcel',
            },
          },
        },
      },
      Parcel: {
        type: 'object',
        $defs: {
          Dimension: {
            type: 'object',
            properties: {
              unitOfMeasure: {
                type: 'string',
              },
              width: {
                type: 'number',
              },
            },
          },
          Unused: {
            type: 'object',
            properties: {
              defsOnly: {
                type: 'string',
              },
            },
          },
        },
        properties: {
          parcelId: {
            type: 'string',
          },
          grossWeight: {
            type: ['number', 'null'],
          },
        },
      },
      Carrier: {
        type: 'object',
        properties: {
          carrierCode: {
            type: 'string',
          },
          scacCode: {
            type: 'string',
          },
        },
      },
      Tracking: {
        type: 'object',
        properties: {
          trackingNumber: {
            type: 'string',
          },
        },
      },
      DelayEvent: {
        type: 'object',
        properties: {
          delayMinutes: {
            type: 'integer',
          },
        },
      },
    },
    pathItems: {
      ShipmentItem: {
        get: {
          responses: {
            200: {
              description: 'Shipment',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Shipment',
                  },
                },
              },
            },
          },
        },
        patch: {
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    patchReason: {
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
      DelayHook: {
        post: {
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/DelayEvent',
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
      UnusedItem: {
        post: {
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    unused_item_field: {
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
