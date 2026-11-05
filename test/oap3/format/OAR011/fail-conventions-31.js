module.exports = {
  "openapi": "3.1.0",
  "info": {
    "title": "Payment Gateway API",
    "version": "3.0.0"
  },
  "servers": [
    {
      "url": "{scheme}://api.example.com/payments/v3",
      "variables": {
        "scheme": {
          "default": "https",
          "enum": [
            "https",
            "http"
          ]
        }
      }
    },
    {
      "url": "//api.example.com/payment-gateway/v3"
    },
    {
      "url": "https://api.example.com:8443/paymentGateway/v3?tenant=Retail_EU#Docs"
    },
    {
      "url": "/PaymentGateway/V3"
    },
    {
      "url": "{baseUrl}",
      "variables": {
        "baseUrl": {
          "default": "https://api.example.com/Payment_Gateway/v3"
        }
      }
    }
  ],
  "paths": {
    "/payments": {
      "$ref": "#/components/pathItems/PaymentCollection"
    },
    "/payments/{paymentId}/refundRequests": {
      "$ref": "#/components/pathItems/refund-requests"
    },
    "/payments/{paymentId}/refunds": {
      "get": {
        "operationId": "operation1",
        "summary": "Operation on /payments/{paymentId}/refunds",
        "parameters": [
          {
            "name": "paymentId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Operation on /payments/{paymentId}/refunds",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Envelope"
                }
              }
            }
          },
          "default": {
            "description": "Unexpected error"
          }
        }
      }
    },
    "/payment_links": {
      "get": {
        "operationId": "operation2",
        "summary": "Operation on /payment_links",
        "responses": {
          "200": {
            "description": "Operation on /payment_links",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Envelope"
                }
              }
            }
          },
          "default": {
            "description": "Unexpected error"
          }
        }
      }
    },
    "/PaymentLinks/{LinkId}": {
      "get": {
        "operationId": "operation3",
        "summary": "Operation on /PaymentLinks/{LinkId}",
        "parameters": [
          {
            "name": "LinkId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Operation on /PaymentLinks/{LinkId}",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Envelope"
                }
              }
            }
          },
          "default": {
            "description": "Unexpected error"
          }
        }
      }
    },
    "/payments/{paymentId}/receipt.pdf": {
      "get": {
        "operationId": "operation4",
        "summary": "Operation on /payments/{paymentId}/receipt.pdf",
        "parameters": [
          {
            "name": "paymentId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Operation on /payments/{paymentId}/receipt.pdf",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Envelope"
                }
              }
            }
          },
          "default": {
            "description": "Unexpected error"
          }
        }
      }
    },
    "/payments/{paymentId}/Receipt.PDF": {
      "get": {
        "operationId": "operation5",
        "summary": "Operation on /payments/{paymentId}/Receipt.PDF",
        "parameters": [
          {
            "name": "paymentId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Operation on /payments/{paymentId}/Receipt.PDF",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Envelope"
                }
              }
            }
          },
          "default": {
            "description": "Unexpected error"
          }
        }
      }
    },
    "/settlements/v2.0/dailyReports": {
      "get": {
        "operationId": "operation6",
        "summary": "Operation on /settlements/v2.0/dailyReports",
        "responses": {
          "200": {
            "description": "Operation on /settlements/v2.0/dailyReports",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Envelope"
                }
              }
            }
          },
          "default": {
            "description": "Unexpected error"
          }
        }
      }
    }
  },
  "webhooks": {
    "paymentSettled": {
      "post": {
        "operationId": "paymentSettled",
        "summary": "Payment settled",
        "responses": {
          "200": {
            "description": "Payment settled",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Envelope"
                }
              }
            }
          },
          "default": {
            "description": "Unexpected error"
          }
        }
      }
    },
    "Refund_Issued": {
      "post": {
        "operationId": "refundIssued",
        "summary": "Refund issued",
        "responses": {
          "200": {
            "description": "Refund issued",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Envelope"
                }
              }
            }
          },
          "default": {
            "description": "Unexpected error"
          }
        }
      }
    }
  },
  "components": {
    "schemas": {
      "Envelope": {
        "type": "object",
        "properties": {
          "data": {
            "type": [
              "object",
              "null"
            ]
          },
          "error": {
            "type": [
              "object",
              "null"
            ]
          }
        }
      }
    },
    "pathItems": {
      "PaymentCollection": {
        "get": {
          "operationId": "listPayments",
          "summary": "List payments",
          "responses": {
            "200": {
              "description": "List payments",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Envelope"
                  }
                }
              }
            },
            "default": {
              "description": "Unexpected error"
            }
          }
        }
      },
      "refund-requests": {
        "get": {
          "operationId": "listRefundRequests",
          "summary": "List refund requests",
          "parameters": [
            {
              "name": "paymentId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "List refund requests",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Envelope"
                  }
                }
              }
            },
            "default": {
              "description": "Unexpected error"
            }
          }
        }
      }
    }
  }
};
