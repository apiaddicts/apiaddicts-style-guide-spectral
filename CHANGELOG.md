
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).


## [Unreleased]

### Added

### Changed

### Removed

### Fixed

### Security

## [1.1.3] - 2026-04-24

### Fixed
- OAR066 - OAR066SnakeCaseNamingConvention - RequestBody and Responses schema property names must be compliant with the snake_case naming convention.

## [1.1.2] - 2026-03-25

### Fixed
- OAR014 - ResourceLevelWithinNonSuggestedRange - The number of parts of the path must be less than 4
- OAR022 - OrderbyParameter - $orderby must be defined as a query parameter in this operation
- OAR025 - LimitParameter - $limit must be defined as a query parameter in this operation
- OAR010 - DefaultResponseMediaType - Default response media type should be defined for responses
- OAR100 - LastPartBasePath - The last part of the path should be the API version

## [1.1.1] - 2026-03-04

### Fixed
- OAR016 - NumericFormat - Numeric types must use a valid format for their type
- OAR031 - Examples - Parameters, Request Body and Responses must have an examples defined
- OAR076 - NumericFormat - Schema should use well-defined type and format
- OAR091 - ParamOnlyRef - Parameters must contain only $ref references
- OAR011 - NamingConvention - The resource names with more than two words must be compliant with the standard naming convention

## [1.1.0] - 2026-01-07

### Added

New rules added
- OAR042 - BasePath - Base path must be compliant with the standard
- OAR053 - ResponseHeaders - There are mandatory response headers and others that are not allowed
- OAR113 - CustomField - Field or extension must be at the assigned location
- OAR115 - VerifyRequiredFields - The data in the required field must exist in schema parameters

### Fixed

- OAR078 - VerbsSecurity
- OAR079 - PathParameter404

## [1.0.0] - 2025-12-29

### Added

New rules added
- OAR052 - UndefinedNumericFormat - Numeric types requires a forma
- OAR114 - HttpResponseHeaders - There are mandatory request headers and others that are not allowed
- OAR039 - StandardResponseCodes - Response codes must be defined according to the standard
