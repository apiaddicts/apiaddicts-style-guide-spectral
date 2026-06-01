
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


## [1.3.0-beta.5] - 2026-05-31

### Fixed

- OAR017 - AlternatePaths - Fixed false positive by checking the first segment against `except` before the loop and treating it as a pseudo-variable when it matches.
- OAR020 - ExpandParameter - Fixed false negative where GET operations with the `parameters` block entirely absent were not detected.
- OAR021 - ExcludeParameter - Same fix as OAR020 applied for `$exclude` parameter.
- OAR037 - StringFormat - Fixed false negative where string schemas without a `format` field were not reported. Replaced built-in `schema` function with custom `apq-schema-format` function that fires for both missing and invalid formats, aligning with Sonar behavior.
- OAR038 - StandardCreateResponse - New rule: POST 201 responses must have a schema with a `data` or `error` property, each with at least one sub-property defined. Added custom function `apq-valid-response-schema`.
- OAR066 - SnakeCaseNamingConvention - Fixed false positives on industry-standard property name prefixes. Replaced built-in function with `pattern.match` using regex which exempts: `_`-prefixed names, `@`-prefixed names and `x-`-prefixed names.
- OAR073 - RateLimit - Fixed false positive where health-check paths still triggered the rule. Extended excluded paths to: `/status`, `/health`, `/health-check`, `/ping`, `/liveness`, `/readiness`, aligning with Sonar's default exclusion list.

## [1.3.0-beta.4] - 2026-05-29

### Fixed

- OAR004 - ValidWso2ScopesRoles - Fixed false negative where `roles` defined as a YAML/JSON array were not validated element by element. Added custom function to handle both string and array values, reporting an error for each invalid array element individually.
- OAR014 - ResourceLevelWithinNonSuggestedRange - Updated documentation (`docs/resources/OAR014.md`) to correctly state that path parameters (e.g. `{customerId}`) and special segments (e.g. `me`) are excluded from the depth count — only literal resource names count.
- OAR015 - ResourceLevelMaxAllowed - Fixed false negative where paths composed entirely of path parameters (e.g. `/{p1}/{p2}/{p3}/{p4}/{p5}/{p6}`) were not detected. Path parameters and `/me` segments are excluded from the depth count, and only literal resource names count toward the limit.

## [1.3.0-beta.3] - 2026-05-27

### Fixed
- OAR004 - ValidWso2ScopesRoles - Updated allowed characters pattern from `^[A-Za-z0-9_]+$` to `^[a-zA-Z0-9_\-., ]+$`, allowing comma-separated roles, dashes and dots.
- OAR008 - AllowedHttpVerb - Fixed rule logic: replaced incorrect `truthy` check on allowed verbs with `falsy` check on forbidden verbs (`head`, `options`, `trace`).
- OAR043 - ParsingError - Updating error messages.

## [1.3.0-beta.2] - 2026-05-26

### Fixed
- OAR031 - Examples - Fixed error message

## [1.3.0-beta.1] - 2026-05-20

### Added
- OAR043 - ParsingError - OpenAPI file cannot be parsed

### Changed
- OAR031 - Examples - Responses, Request Body, Parameters and Properties must have an example defined

### Fixed
- OAR014 - ResourceLevelWithinNonSuggestedRange - Resources depth level should be below the non-suggested range

## [1.2.0] - 2026-04-30

### Changed
- OAR018 - ResourcesByVerb - Added POST patterns for `archive`, `clone` and `restore` actions.
- OAR019 - SelectParameter - Narrowed scope to collection endpoints, excluding `/me`, detail and health check paths
- OAR020 - ExpandParameter - Narrowed scope to collection endpoints, excluding `/me`, detail and health check paths
- OAR021 - ExcludeParameter - Narrowed scope to collection endpoints, excluding `/me`, detail and health check paths
- OAR023 - TotalParameter - Narrowed scope to collection endpoints, excluding `/me`, detail and health check paths
- OAR024 - StartParameter - Narrowed scope to collection endpoints, excluding `/me`, detail and health check paths
- OAR025 - LimitParameter - Narrowed scope to exclude health check paths; `$limit` parameter now requires `schema.type: integer`
- OAR030 - StatusEndpoint - Replaced hardcoded `/status` path check with configurable `apq-status-endpoint-check` function
- OAR032 - AmbiguousElementsPath - Replaced regex pattern with configurable `apq-check-ambiguous-path` function
- OAR033 - HttpHeaders - Clarified description and message to indicate REQUEST header validation only
- OAR034 - StandardPagedResponseSchema - Replaced content existence check with `apq-paged-response-check` function validating full paging schema.
- OAR035 - UnauthorizedResponse - Replaced field-level 401 check with `apq-security-required-response` function
- OAR037 - StringFormat - Added valid string formats; excluded `enum` fields from format validation
- OAR051 - DescriptionDiffersSummary - Updated description and message for clarity

### Fixed
- OAR028 - FilterParameter - $filter must be defined as a query parameter in this operation.
- OAR066 - SnakeCaseNamingConvention - RequestBody and Responses schema property names must be compliant with the snake_case naming convention.

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
