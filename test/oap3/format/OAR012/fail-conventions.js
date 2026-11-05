module.exports = {
  "openapi": "3.0.3",
  "info": {
    "title": "Naming Conventions Matrix API",
    "version": "1.0.0"
  },
  "paths": {
    "/accounts": {
      "get": {
        "parameters": [
          {
            "name": "order_id",
            "in": "query",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "order-id",
            "in": "query",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "orderId",
            "in": "query",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "OrderId",
            "in": "query",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "",
            "in": "query",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "$filter",
            "in": "query",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "$orderby",
            "in": "query",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Accounts",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/account_matrix"
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
      "account_matrix": {
        "type": "object",
        "properties": {
          "address_line2": {
            "type": "string"
          },
          "address-line2": {
            "type": "string"
          },
          "addressLine2": {
            "type": "string"
          },
          "AddressLine2": {
            "type": "string"
          },
          "oauth2Token": {
            "type": "string"
          },
          "customerID": {
            "type": "string"
          },
          "HTTPStatus": {
            "type": "string"
          },
          "id": {
            "type": "string"
          },
          "ID": {
            "type": "string"
          },
          "v2": {
            "type": "string"
          },
          "user/name": {
            "type": "string"
          },
          "{tenant}": {
            "type": "string"
          },
          "_internal": {
            "type": "string"
          },
          "user name": {
            "type": "string"
          },
          "$custom": {
            "type": "string"
          },
          "A": {
            "type": "string"
          },
          "iban": {
            "type": "string"
          },
          "Iban": {
            "type": "string"
          }
        }
      }
    }
  }
};
