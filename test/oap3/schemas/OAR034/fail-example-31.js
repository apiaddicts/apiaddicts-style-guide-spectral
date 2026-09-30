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
                  "type": "object",
                  "properties": {
                    "data": {
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
    "/brokers": {
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
    "/null-first": {
      "get": {
        "responses": {
          "200": {
            "description": "Ok",
            "content": {
              "application/json": {
                "schema": {
                  "type": [
                    "null",
                    "array"
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
    "/claims": {
      "get": {
        "responses": {
          "200": {
            "description": "Ok",
            "content": {
              "application/json": {
                "schema": {
                  "anyOf": [
                    {
                      "$ref": "#/components/schemas/ClaimList"
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
    },
    "/workshops": {
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
                      "anyOf": [
                        {
                          "type": "array",
                          "items": {
                            "type": "string"
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
    },
    "/vehicles": {
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
                    "results": {
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
    "/customers": {
      "get": {
        "responses": {
          "200": {
            "description": "Ok",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "results": {
                      "type": "array"
                    },
                    "paging": {
                      "type": [
                        "object",
                        "null"
                      ],
                      "properties": {
                        "start": {
                          "type": "integer"
                        },
                        "limit": {
                          "type": "integer"
                        },
                        "total": {
                          "type": "integer"
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
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/quotes": {
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
                      "type": "object",
                      "required": [
                        "start",
                        "limit",
                        "links"
                      ],
                      "properties": {
                        "start": {
                          "type": [
                            "string",
                            "null"
                          ]
                        },
                        "limit": {
                          "type": "integer"
                        },
                        "total": {
                          "type": "integer"
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
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/renewals": {
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
                      "type": [
                        "array",
                        "null"
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
    "/repairs": {
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
                      "oneOf": [
                        {
                          "$ref": "#/components/schemas/PagingWithoutStart"
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
                            "number",
                            "null"
                          ]
                        },
                        "numPages": {
                          "type": "integer"
                        },
                        "links": {
                          "type": [
                            "object",
                            "null"
                          ],
                          "required": [
                            "self",
                            "previous"
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
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/archived-policies": {
      "$ref": "#/components/pathItems/ArchivedPolicies"
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
                        "type": "array",
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
      }
    },
    "schemas": {
      "ClaimList": {
        "type": "object",
        "properties": {
          "items": {
            "type": "array",
            "items": {
              "type": "string"
            }
          }
        }
      },
      "PagingWithoutStart": {
        "type": "object",
        "required": [
          "limit",
          "links"
        ],
        "properties": {
          "limit": {
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
                "type": "array",
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
};
