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
                  "$ref": "#/components/schemas/product/allOf/1/properties/unit_price"
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
            "name": "product_id",
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
          "page_info": {
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
              "product_name": {
                "type": "string"
              },
              "unit_price": {
                "type": "object",
                "properties": {
                  "currency_code": {
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
          "created_by": {
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
          "category_name": {
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
            "resource_uri": {
              "type": "string"
            }
          }
        }
      }
    }
  }
};
