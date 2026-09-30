module.exports = {
  "openapi": "3.2.0",
  "info": {
    "title": "Insurance Policy API",
    "version": "1.0.0"
  },
  "paths": {
    "/claims": {
      "get": {
        "responses": {
          "200": {
            "description": "Ok",
            "content": {
              "application/json": {
                "$ref": "#/components/mediaTypes/ClaimCollectionJson"
              }
            }
          }
        }
      }
    },
    "/losses": {
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
                    }
                  }
                }
              },
              "application/jsonl": {
                "itemSchema": {
                  "type": "object"
                }
              }
            }
          }
        }
      }
    },
    "/contractors": {
      "get": {
        "responses": {
          "200": {
            "$ref": "#/components/responses/ContractorList"
          }
        }
      }
    },
    "/settlements": {
      "get": {
        "responses": {
          "2XX": {
            "summary": "Settlements",
            "description": "Ok",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "values": {
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
    "/appointments": {
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
                          "type": [
                            "boolean",
                            "null"
                          ]
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
    }
  },
  "components": {
    "mediaTypes": {
      "ClaimCollectionJson": {
        "schema": {
          "type": "object",
          "properties": {
            "data": {
              "type": "array",
              "items": {
                "type": "string"
              }
            }
          }
        }
      }
    },
    "responses": {
      "ContractorList": {
        "summary": "Contractors",
        "description": "Ok",
        "content": {
          "application/json": {
            "schema": {
              "type": "object",
              "properties": {
                "results": {
                  "type": "array"
                }
              }
            }
          }
        }
      }
    }
  },
  "$self": "https://api.insurer.example.com/specs/home-claims/openapi.yaml"
};
