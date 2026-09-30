module.exports = {
  "openapi": "3.1.0",
  "info": {
    "title": "Insurance Policy API",
    "version": "1.0.0"
  },
  "paths": {
    "/policies": {
      "get": {
        "responses": {
          "200": {
            "description": "Ok",
            "content": {
              "application/json": {
                "schema": {
                  "type": [
                    "object",
                    "null"
                  ],
                  "properties": {
                    "data": {
                      "type": [
                        "array",
                        "null"
                      ],
                      "items": {
                        "type": "string"
                      }
                    },
                    "paging": {
                      "type": [
                        "object",
                        "null"
                      ],
                      "required": [
                        "start",
                        "limit",
                        "links"
                      ],
                      "properties": {
                        "start": {
                          "type": [
                            "integer",
                            "null"
                          ]
                        },
                        "limit": {
                          "type": "integer"
                        },
                        "total": {
                          "type": [
                            "null",
                            "integer"
                          ]
                        },
                        "numPages": {
                          "type": [
                            "integer",
                            "string"
                          ]
                        },
                        "links": {
                          "type": [
                            "object",
                            "null"
                          ],
                          "required": [
                            "self",
                            "previous",
                            "next"
                          ],
                          "properties": {
                            "self": {
                              "type": "object",
                              "properties": {
                                "href": {
                                  "type": "string"
                                }
                              }
                            },
                            "previous": {
                              "anyOf": [
                                {
                                  "type": "object",
                                  "properties": {
                                    "href": {
                                      "type": "string"
                                    }
                                  }
                                },
                                {
                                  "type": "null"
                                }
                              ]
                            },
                            "next": {
                              "oneOf": [
                                {
                                  "type": "object",
                                  "properties": {
                                    "href": {
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
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/claims": {
      "get": {
        "responses": {
          "200": {
            "description": "Ok",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "items": {
                      "type": "array"
                    },
                    "paging": {
                      "anyOf": [
                        {
                          "$ref": "#/components/schemas/Paging"
                        },
                        {
                          "type": "null"
                        }
                      ]
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/photos": {
      "get": {
        "responses": {
          "200": {
            "description": "Ok",
            "content": {
              "application/json": {
                "schema": {
                  "allOf": [
                    {
                      "type": "object",
                      "properties": {
                        "paging": {
                          "oneOf": [
                            {
                              "$ref": "#/components/schemas/Paging"
                            },
                            {
                              "type": "null"
                            }
                          ]
                        }
                      }
                    },
                    {
                      "type": "object",
                      "properties": {
                        "results": {
                          "type": "array"
                        }
                      }
                    }
                  ]
                }
              }
            }
          }
        }
      }
    },
    "/drivers": {
      "get": {
        "responses": {
          "200": {
            "description": "Ok",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "data": {
                      "type": "array"
                    },
                    "paging": {
                      "$ref": "#/components/schemas/Paging",
                      "description": "Standard paging block"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/fleet/label": {
      "get": {
        "responses": {
          "200": {
            "description": "Ok",
            "content": {
              "application/json": {
                "schema": {
                  "type": [
                    "string",
                    "null"
                  ]
                }
              }
            }
          }
        }
      }
    },
    "/fleet/nothing": {
      "get": {
        "responses": {
          "200": {
            "description": "Ok",
            "content": {
              "application/json": {
                "schema": {
                  "type": "null"
                }
              }
            }
          }
        }
      }
    },
    "/fleet/status": {
      "get": {
        "responses": {
          "200": {
            "description": "Ok",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "data": {
                      "type": [
                        "object",
                        "null"
                      ],
                      "properties": {
                        "active": {
                          "type": "integer"
                        }
                      }
                    },
                    "coordinates": {
                      "type": "array",
                      "prefixItems": [
                        {
                          "type": "number"
                        },
                        {
                          "type": "number"
                        }
                      ],
                      "items": false
                    },
                    "alerts": {
                      "type": [
                        "array",
                        "null"
                      ],
                      "items": {
                        "type": "string"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/claims/{claimId}/timeline/{eventId}": {
      "get": {
        "responses": {
          "200": {
            "description": "Ok",
            "content": {
              "application/json": {
                "schema": {
                  "type": [
                    "array",
                    "null"
                  ],
                  "items": {
                    "type": "string"
                  }
                }
              }
            }
          }
        }
      }
    },
    "/fleets": {
      "get": {
        "responses": {
          "200": {
            "description": "Ok",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/FleetEnvelope/$defs/FleetPage"
                }
              }
            }
          }
        }
      }
    },
    "/archived-policies": {
      "$ref": "#/components/pathItems/ArchivedPolicies"
    }
  },
  "components": {
    "pathItems": {
      "ArchivedPolicies": {
        "get": {
          "responses": {
            "200": {
              "description": "Ok",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "rows": {
                        "type": "array"
                      },
                      "paging": {
                        "$ref": "#/components/schemas/Paging"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "schemas": {
      "Paging": {
        "type": "object",
        "required": [
          "start",
          "limit",
          "links"
        ],
        "properties": {
          "start": {
            "type": "integer"
          },
          "limit": {
            "type": "integer"
          },
          "total": {
            "type": [
              "integer",
              "null"
            ]
          },
          "numPages": {
            "type": "integer"
          },
          "links": {
            "type": "object",
            "required": [
              "self",
              "previous",
              "next"
            ],
            "properties": {
              "self": {
                "type": "object",
                "properties": {
                  "href": {
                    "type": "string"
                  }
                }
              },
              "first": {
                "type": "object",
                "properties": {
                  "href": {
                    "type": "string"
                  }
                }
              },
              "previous": {
                "type": "object",
                "properties": {
                  "href": {
                    "type": "string"
                  }
                }
              },
              "next": {
                "type": "object",
                "properties": {
                  "href": {
                    "type": "string"
                  }
                }
              },
              "last": {
                "type": "object",
                "properties": {
                  "href": {
                    "type": "string"
                  }
                }
              }
            }
          }
        }
      },
      "FleetEnvelope": {
        "$defs": {
          "FleetPage": {
            "type": "object",
            "properties": {
              "list": {
                "type": "array"
              },
              "paging": {
                "$ref": "#/components/schemas/Paging"
              }
            }
          }
        }
      }
    }
  }
};
