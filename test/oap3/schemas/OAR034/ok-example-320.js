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
                "$ref": "#/components/mediaTypes/ClaimPageJson"
              },
              "application/jsonl": {
                "itemSchema": {
                  "type": "object",
                  "properties": {
                    "claimId": {
                      "type": "string"
                    }
                  }
                }
              },
              "text/event-stream": {
                "itemSchema": {
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
            }
          }
        }
      },
      "query": {
        "responses": {
          "200": {
            "description": "Ok",
            "content": {
              "application/json": {
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
            }
          }
        }
      },
      "additionalOperations": {
        "SEARCH": {
          "responses": {
            "200": {
              "description": "Ok",
              "content": {
                "application/json": {
                  "schema": {
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
    },
    "/payouts": {
      "get": {
        "responses": {
          "2XX": {
            "summary": "Payouts",
            "description": "Ok",
            "content": {
              "application/json": {
                "schema": {
                  "type": [
                    "object",
                    "null"
                  ],
                  "properties": {
                    "values": {
                      "type": [
                        "array",
                        "null"
                      ]
                    },
                    "paging": {
                      "anyOf": [
                        {
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
  },
  "components": {
    "mediaTypes": {
      "ClaimPageJson": {
        "schema": {
          "type": "object",
          "properties": {
            "data": {
              "type": "array",
              "items": {
                "type": "string"
              }
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
  },
  "webhooks": {
    "claimsSnapshot": {
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
  }
};
