module.exports = {
  "swagger": "2.0",
  "info": {
    "title": "Insurance Policy API",
    "version": "1.0.0"
  },
  "produces": [
    "application/json"
  ],
  "paths": {
    "/missing-limit": {
      "get": {
        "responses": {
          "200": {
            "description": "Ok",
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
                    "links"
                  ],
                  "properties": {
                    "start": {
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
    },
    "/not-listed": {
      "get": {
        "responses": {
          "200": {
            "description": "Ok",
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
                  "required": [],
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
    },
    "/start-string": {
      "get": {
        "responses": {
          "200": {
            "description": "Ok",
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
                      "type": "string"
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
    },
    "/paging-array": {
      "get": {
        "responses": {
          "200": {
            "description": "Ok",
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
                  "type": "array",
                  "items": {
                    "type": "integer"
                  }
                }
              }
            }
          }
        }
      }
    },
    "/links-self-only": {
      "get": {
        "responses": {
          "200": {
            "description": "Ok",
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
                        "self"
                      ],
                      "properties": {
                        "self": {
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
    },
    "/href-integer": {
      "get": {
        "responses": {
          "200": {
            "description": "Ok",
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
                              "type": "integer"
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
    },
    "/nullable-paging": {
      "get": {
        "responses": {
          "200": {
            "description": "Ok",
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
                    "limit"
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
                  },
                  "x-nullable": true
                }
              }
            }
          }
        }
      }
    },
    "/brokers/{brokerId}": {
      "get": {
        "responses": {
          "200": {
            "description": "Ok",
            "schema": {
              "type": "object",
              "properties": {
                "paging": {
                  "type": "object",
                  "required": [
                    "start"
                  ],
                  "properties": {
                    "start": {
                      "type": "integer"
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
