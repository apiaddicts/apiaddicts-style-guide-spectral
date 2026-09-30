module.exports = {
  "openapi": "3.0.3",
  "info": {
    "title": "Insurance Policy API",
    "version": "1.0.0"
  },
  "paths": {
    "/missing-start": {
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
                    },
                    "paging": {
                      "type": "object",
                      "required": [
                        "limit",
                        "links"
                      ],
                      "properties": {
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
    "/missing-all": {
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
                    },
                    "paging": {
                      "type": "object",
                      "properties": {
                        "total": {
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
    },
    "/no-properties": {
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
                    },
                    "paging": {
                      "type": "object"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/empty-paging": {
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
                    },
                    "paging": {}
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
                    },
                    "paging": {
                      "type": "object",
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
    "/partially-listed": {
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
                    },
                    "paging": {
                      "type": "object",
                      "required": [
                        "start"
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
    "/start-string": {
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
        }
      }
    },
    "/total-number": {
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
                          "type": "number"
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
    "/paging-array": {
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
        }
      }
    },
    "/paging-string": {
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
                    },
                    "paging": {
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
    "/links-string": {
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
    "/links-self-only": {
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
        }
      }
    },
    "/links-not-listed": {
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
    "/href-integer": {
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
                                  "type": "integer"
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
    "/link-not-object": {
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
                              "type": "string"
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
    "/paging-all-of": {
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
                    },
                    "paging": {
                      "allOf": [
                        {
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
                            }
                          }
                        },
                        {
                          "type": "object",
                          "required": [
                            "links"
                          ],
                          "properties": {
                            "links": {
                              "type": "object",
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
                                "previous": {
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
    "/brokers/{brokerId}": {
      "get": {
        "responses": {
          "200": {
            "description": "Ok",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "broker": {
                      "type": "object"
                    },
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
    },
    "/detail-with-bad-paging/{id}": {
      "get": {
        "responses": {
          "200": {
            "description": "Ok",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "paging": {
                      "type": "array"
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
