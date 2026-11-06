module.exports = {
  "openapi": "3.0.3",
  "info": {
    "title": "Catalog API",
    "version": "1.0.0"
  },
  "paths": {
    "/products": {
      "get": {
        "responses": {
          "200": {
            "description": "Page",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/product_page"
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
                "$ref": "#/components/schemas/product"
              }
            }
          }
        },
        "responses": {
          "201": {
            "$ref": "#/components/responses/product_created"
          }
        }
      }
    },
    "/products/{product_id}": {
      "$ref": "#/x-path-items/product_item"
    },
    "/categories": {
      "get": {
        "responses": {
          "200": {
            "description": "Tree",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/category"
                }
              }
            }
          }
        }
      }
    },
    "/prices": {
      "get": {
        "responses": {
          "200": {
            "description": "Price",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/product/allOf/1/properties/unitPrice"
                }
              }
            }
          }
        }
      }
    },
    "/missing": {
      "get": {
        "responses": {
          "200": {
            "description": "Dangling",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/does_not_exist"
                }
              }
            }
          }
        }
      }
    }
  },
  "x-path-items": {
    "product_item": {
      "get": {
        "parameters": [
          {
            "name": "productId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Product",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/product"
                }
              }
            }
          }
        }
      }
    }
  },
  "components": {
    "schemas": {
      "product_page": {
        "type": "object",
        "properties": {
          "items": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/product"
            }
          },
          "pageInfo": {
            "type": "object"
          }
        }
      },
      "product": {
        "allOf": [
          {
            "$ref": "#/components/schemas/base_alias"
          },
          {
            "type": "object",
            "properties": {
              "productName": {
                "type": "string"
              },
              "unitPrice": {
                "type": "object",
                "properties": {
                  "currencyCode": {
                    "type": "string"
                  }
                }
              }
            }
          }
        ]
      },
      "base_alias": {
        "$ref": "#/components/schemas/base_model"
      },
      "base_model": {
        "type": "object",
        "properties": {
          "createdBy": {
            "type": "string"
          }
        }
      },
      "category": {
        "type": "object",
        "properties": {
          "sub_categories": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/category"
            }
          },
          "categoryName": {
            "type": "string"
          }
        }
      },
      "sibling_ignored": {
        "$ref": "#/components/schemas/base_model",
        "properties": {
          "siblingIn30": {
            "type": "string"
          }
        }
      }
    },
    "responses": {
      "product_created": {
        "description": "Created",
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/product"
            }
          }
        },
        "headers": {
          "Location": {
            "$ref": "#/components/headers/location_header"
          }
        }
      }
    },
    "headers": {
      "location_header": {
        "schema": {
          "type": "object",
          "properties": {
            "resourceUri": {
              "type": "string"
            }
          }
        }
      }
    }
  }
};
