module.exports = {
  "openapi": "3.1.0",
  "info": {
    "title": "Freight Quotes API",
    "version": "1.0.0"
  },
  "paths": {
    "/quotes": {
      "get": {
        "responses": {
          "200": {
            "description": "Quotes",
            "content": {
              "application/json": {
                "schema": {
                  "type": [
                    "object",
                    "null"
                  ],
                  "allOf": [
                    {
                      "$ref": "#/components/schemas/quote_base"
                    },
                    {
                      "type": "object",
                      "properties": {
                        "quote_ref": {
                          "type": [
                            "string",
                            "null"
                          ]
                        },
                        "options": {
                          "type": "array",
                          "items": {
                            "oneOf": [
                              {
                                "$ref": "#/components/schemas/air_option"
                              },
                              {
                                "$ref": "#/components/schemas/sea_option"
                              },
                              {
                                "type": "object",
                                "properties": {
                                  "road_carrier": {
                                    "type": "string"
                                  }
                                }
                              }
                            ],
                            "discriminator": {
                              "propertyName": "mode"
                            }
                          }
                        }
                      }
                    },
                    {
                      "anyOf": [
                        {
                          "type": "object",
                          "properties": {
                            "insurance_fee": {
                              "type": [
                                "number",
                                "null"
                              ]
                            }
                          }
                        },
                        {
                          "type": [
                            "object",
                            "null"
                          ],
                          "properties": {
                            "customs_fee": {
                              "type": "number"
                            },
                            "handling": {
                              "oneOf": [
                                {
                                  "type": "object",
                                  "properties": {
                                    "handling_code": {
                                      "type": "string"
                                    }
                                  }
                                },
                                {
                                  "type": "null"
                                }
                              ]
                            }
                          }
                        }
                      ]
                    }
                  ]
                }
              }
            }
          }
        }
      },
      "post": {
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "oneOf": [
                  {
                    "$ref": "#/components/schemas/air_option",
                    "properties": {
                      "flight_number": {
                        "type": "string"
                      }
                    }
                  },
                  {
                    "anyOf": [
                      {
                        "$ref": "#/components/schemas/sea_option"
                      }
                    ]
                  }
                ]
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Created"
          }
        }
      }
    }
  },
  "components": {
    "schemas": {
      "quote_base": {
        "type": "object",
        "properties": {
          "quote_id": {
            "type": "string"
          },
          "valid_until": {
            "type": [
              "string",
              "null"
            ]
          }
        }
      },
      "air_option": {
        "type": "object",
        "properties": {
          "mode": {
            "const": "air"
          },
          "airport_code": {
            "type": "string"
          }
        }
      },
      "sea_option": {
        "type": "object",
        "oneOf": [
          {
            "properties": {
              "vessel_name": {
                "type": "string"
              }
            }
          },
          {
            "properties": {
              "container_id": {
                "type": "string"
              }
            }
          }
        ],
        "anyOf": [
          {
            "$ref": "#/components/schemas/quote_base"
          }
        ]
      }
    }
  }
};
