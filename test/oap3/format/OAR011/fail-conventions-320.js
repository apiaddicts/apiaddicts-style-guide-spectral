module.exports = {
  "openapi": "3.2.0",
  "$self": "https://specs.example.com/FleetTelemetry/openapi.yaml",
  "info": {
    "title": "Fleet Telemetry API",
    "version": "2.0.0"
  },
  "servers": [
    {
      "url": "https://api.example.com/fleet-telemetry/v2",
      "name": "kebab"
    },
    {
      "url": "https://api.example.com/fleetTelemetry/v2",
      "name": "camel"
    },
    {
      "url": "https://api.example.com/FleetTelemetry/V2",
      "name": "upperCamel"
    },
    {
      "url": "https://api.example.com/fleet_telemetry/v2",
      "name": "snake"
    },
    {
      "url": "https://api.example.com",
      "name": "root"
    }
  ],
  "paths": {
    "/vehicles": {
      "get": {
        "operationId": "listVehicles",
        "summary": "List vehicles",
        "responses": {
          "200": {
            "description": "List vehicles",
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
      },
      "query": {
        "operationId": "searchVehicles",
        "summary": "Search vehicles",
        "responses": {
          "200": {
            "description": "Found vehicles"
          }
        }
      },
      "additionalOperations": {
        "LINK": {
          "operationId": "linkVehicles",
          "responses": {
            "204": {
              "description": "Linked"
            }
          }
        }
      }
    },
    "/vehicles/{vehicleId}/gpsPositions": {
      "get": {
        "operationId": "operation1",
        "summary": "Operation on /vehicles/{vehicleId}/gpsPositions",
        "parameters": [
          {
            "name": "vehicleId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Operation on /vehicles/{vehicleId}/gpsPositions",
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
    "/vehicles/{vehicleId}/gps-positions": {
      "get": {
        "operationId": "operation2",
        "summary": "Operation on /vehicles/{vehicleId}/gps-positions",
        "parameters": [
          {
            "name": "vehicleId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Operation on /vehicles/{vehicleId}/gps-positions",
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
    "/vehicles/{vehicleId}/gps_positions": {
      "get": {
        "operationId": "operation3",
        "summary": "Operation on /vehicles/{vehicleId}/gps_positions",
        "parameters": [
          {
            "name": "vehicleId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Operation on /vehicles/{vehicleId}/gps_positions",
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
    "/Vehicles/{VehicleId}/GpsPositions": {
      "get": {
        "operationId": "operation4",
        "summary": "Operation on /Vehicles/{VehicleId}/GpsPositions",
        "parameters": [
          {
            "name": "VehicleId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Operation on /Vehicles/{VehicleId}/GpsPositions",
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
    "/vehicles/{vehicleId}/telemetry.csv": {
      "get": {
        "operationId": "operation5",
        "summary": "Operation on /vehicles/{vehicleId}/telemetry.csv",
        "parameters": [
          {
            "name": "vehicleId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Operation on /vehicles/{vehicleId}/telemetry.csv",
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
    "/drivers/{driverId}/licenceV2": {
      "get": {
        "operationId": "operation6",
        "summary": "Operation on /drivers/{driverId}/licenceV2",
        "parameters": [
          {
            "name": "driverId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Operation on /drivers/{driverId}/licenceV2",
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
    "/fleet/HTTPEvents": {
      "get": {
        "operationId": "operation7",
        "summary": "Operation on /fleet/HTTPEvents",
        "responses": {
          "200": {
            "description": "Operation on /fleet/HTTPEvents",
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
    "vehicleOffline": {
      "post": {
        "operationId": "vehicleOffline",
        "summary": "Vehicle offline",
        "responses": {
          "200": {
            "description": "Vehicle offline",
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
          }
        }
      }
    }
  }
};
