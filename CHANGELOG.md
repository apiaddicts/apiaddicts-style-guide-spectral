
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).


## [1.4.1-beta.5] - 2026-08-24

### Added

- OAR116 - PathPattern - New rule: every API path must match a configurable regex `pattern` (default `^/`, i.e. must start with "/"); unanchored match, dynamic message showing the configured pattern.


## [1.4.1-beta.4] - 2026-08-14

### Changed

- OAR020 - Renamed the `parameter-name` functionOption to `parameterName` (Sonar-aligned); explicit `paths`/`pathValidationStrategy` defaults (`/me,/health,/ping,/status`, `/exclude`).
- OAR021 - Same alignment as OAR020 for `$exclude`.
- OAR022 - Switched from builtin `schema` to `apq-collection-query-param-required`; presence-only over paginated (206) `/examples` collection GETs, with configurable `paths`/`pathValidationStrategy`.
- OAR025 - Same as OAR022 for `$limit`; dropped the `type: integer` requirement.


## [1.4.1-beta.3] - 2026-08-12

### Fixed

- OAR035 - Honor an operation-level `security: []` explicit opt-out: the operation is unsecured, so no 401 is required even when document-level security is defined.
- OAR096 - Same `security: []` opt-out fix (shared `apq-security-required-response` function): no 403 required for opted-out operations.

### Added

- OAR081 - Test coverage pinning the current behavior: only string-typed `password` fields are validated; a non-string `password` (e.g. `type: integer`) is intentionally out of scope.

### Changed

- OAR085 - Refreshed `docs/resources/OAR085.md` to list the current default versions (including `3.1.0` and `3.2.0`).


## [1.4.1-beta.2] - 2026-08-05

### Fixed

- OAR035 - `apq-spectral.json` now uses the `apq-security-required-response` function; it still used the core `truthy` over `$.paths[*][*].responses`, requiring a 401 on every operation regardless of whether security was defined.
- OAR069 - Now raises one issue per offending `path`/`query` parameter, anchored to the parameter, instead of a single issue per operation on the `responses` line; `description`/`message` updated to reference the required Bad Request (400) response.
- OAR096 - The 403 requirement is now conditional on security; it previously used the core `truthy` and flagged every operation missing a 403. Reuses `apq-security-required-response` with a `response-code: "403"` option.
- OAR081 - `apq-spectral.json` now uses the `apq-password-format` function over `$..properties`; it carried a stale, incorrect definition (built-in `pattern` over `$..properties[?(@.type == 'string' && @.format == 'number')]`).
- `apq-binary-format-check` (OAR082) - Guard against a null-valued property schema (e.g. `product: null`) before reading `.type`.
- `apq-spectral.json` - Registered `apq-security-required-response`, `apq-path-param-query-conflict` and `apq-password-format` in the `functions` array (referenced by rules but not registered).
- OAR044 - MediaType - Media type parameters now follow RFC 9110 (charset without space, other parameter names, multiple parameters); type/subtype can no longer start with `.`. Synced `apq-spectral.json` with `apq-spectral.yaml` and added the missing `oar044-media-type.test.js` test.
- OAR074 - NumericParameterIntegrity - Spectral's `anyOf` accepted a lone `minimum` or `maximum` as sufficient. Now requires `minimum` and `maximum` together, or `format` alone. Also extended to OpenAPI 2 parameters and to parameters declared at the path-item and `components`/`parameters` level, not just inline on the operation.
- OAR014 / OAR015 - ResourceLevel - Issue message now shows the configured min/max-level values instead of a hardcoded number.
- OAR004 / OAR040 - Wso2Scopes - Issue message now shows the configured `pattern` instead of a static text.

### Changed

- OAR015 - ResourceLevelMaxAllowed - Renamed the `maxDepth` functionOption to `max-level-allowed` to match the Sonar parameter name.
- OAR040 - StandardWso2ScopesName - Switched from the core `pattern` function (option `match`) to `apq-forbidden-characters` (option `pattern`) to match the Sonar parameter name; detection unchanged.
- OAR085 - Added `3.2.0` to the default `valid-versions` (`2.0,3.0.0,3.0.1,3.0.2,3.0.3,3.1.0,3.2.0`).
- Generalized `apq-security-required-response` with a `response-code` option (default `"401"`), shared by OAR035 (401) and OAR096 (403).
- Bumped `@stoplight/spectral-core` (`^1.19.5` → `1.23.0`), `@stoplight/spectral-rulesets` (`^1.20.2` → `1.22.2`), `@stoplight/spectral-functions` (`^1.9.0` → `^1.10.5`) and `@stoplight/spectral-ruleset-migrator` (`^1.10.0` → `^1.12.1`) in `devDependencies`.

### Changed

- OAR015 - ResourceLevelMaxAllowed - Renamed the `maxDepth` functionOption to `max-level-allowed` to match the Sonar parameter name.
- OAR040 - StandardWso2ScopesName - Switched from the core `pattern` function (option `match`) to `apq-forbidden-characters` (option `pattern`) to match the Sonar parameter name; detection unchanged.

## [1.4.1-beta.1] - 2026-07-31

### Fixed

- Null-safety in recursive-descent JSONPath `given` expressions (OAR016, OAR037, OAR052, OAR074, OAR075, OAR076, OAR081, OAR082) - A single `null` node in a document (e.g. `type: null`, `properties: null`, `items: null`, a null property value, or a parameter without `schema`) made filters like `$..[?(@.type==...)]` / `$..[?(@.properties)]` / `parameters[?(@.schema.type==...)]` throw and abort the whole lint run. Added a null guard (`@ && ...`) to each filter; behavior on valid documents is unchanged (a null node was never a valid match).


## [1.4.0] - 2026-07-28

### Fixed

- OAR014 - ResourceLevelWithinNonSuggestedRange - Added `min-level`/`max-level` support; default changed from `maxDepth: 3` to `min-level: 4` / `max-level: 5`, matching the documented "4 and 5" range and the equivalent Sonar rule.
- OAR038 - StandardCreateResponse - `apq-valid-response-schema` never read its `options` (named `_options`) and hardcoded `'data'` as the only valid top-level property name. Now reads a configurable `data-property` functionOption.
- OAR085 - OpenAPIVersion - used the core `pattern` function with a hardcoded regex; there was no way to express a configurable version list. Replaced with a new function, `apq-valid-openapi-version`, that reads a `valid-versions` functionOption.
- OAR004 - ValidWso2ScopesRoles - `apq-forbidden-characters` ignored its `options` entirely and used a hardcoded regex. Now reads a configurable `pattern` functionOption (default unchanged).
- OAR082 - BinaryOrByteFormat - `apq-spectral.json` was wired to the core `pattern` function against `$..properties.*` instead of `apq-binary-format-check`, which wasn't even registered in its `functions` array. This caused both the reported false positives on unrelated `integer`/`format: int32` properties and the inert `fields-to-apply` option.
- OAR019/OAR020/OAR021 - $select/$expand/$exclude required as a query parameter - replaced the hardcoded exclusion regexes baked into each rule's `given` with a new shared function, `apq-collection-query-param-required`, exposing `parameter-name` (required), `paths`, and `pathValidationStrategy`.
- OAR044 - MediaType - Synced the fix into `apq-spectral.json`, which had been missed in 1.4.0-beta.2 (only `apq-spectral.yaml` was updated). The JSON still carried the old regex `^application/[a-zA-Z0-9-_]+$` (rejecting `application/ld+json` and Excel vendor types), a broken `field: "name"`, and a responses-only `given`. Since QA lints against the JSON, valid media types kept being reported as invalid.
- OAR017 - AlternatePaths - Synced the fix into `apq-spectral.json`, which still had `except: ["me","get","search"]` (missing `delete`) while `apq-spectral.yaml` already carried it. Paths such as `/greetings/delete` no longer trigger the rule when linting with the JSON ruleset.
- OAR028 - FilterParameter - Fixed false positives in `apq-spectral.json`: the JSON ruleset had `given: "$.paths[*].get"` without the exclusion regex that `apq-spectral.yaml` already carried. Updated eliminating spurious findings on `/me` endpoints, detail endpoints ending with `/{id}`, and health-check paths (`status`, `health`, `ping`).
- OAR017 - AlternatePaths - Added `delete` to the `except` list (default is now `get,me,search,delete`); paths ending with `/delete` are now treated as pseudo-parameters and no longer trigger the alternation rule.
- OAR044 - MediaType - Fixed overly restrictive regex that rejected valid RFC 6838 media types: vendor-specific types (`application/vnd.ms-excel`, `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`, `application/vnd.github+json`), structured suffixes (`application/ld+json`), non-`application/` families (`text/csv`, `image/png`, `multipart/form-data`), parameterised types (`text/plain; charset=utf-8`), and wildcards (`*/*`, `image/*`). Extended `given` to also validate `requestBody` content.

### Changed

- OAR037 - StringFormat - String schemas must now declare a valid `format`, or a valid `pattern` when no `format` is defined. Aligns with the equivalent security-classified change on the Sonar side (`OAR037StringFormatCheck`).
- OAR037 - StringFormat - Rule no longer fires when a string schema omits the `format` field entirely; it only fires when `format` is present but not a recognized value.
- OAR031 - ExamplesCoverage - Levels are now validated **independently**, each with a level-specific message and precise (per-property) reporting location. The response/request-body level requires a body-level example (a media-type `example`/`examples` or a root `schema.example`); per-property examples no longer satisfy it. This is stricter than 1.3.0 and may surface new findings on existing specs — recommend a minor (or major) version bump on release.

### Added

- OAR020 - ExpandParameter - Added test coverage confirming that single-resource paths ending with a path parameter (e.g. `/users/{id}`), `/me` paths, and health-check paths are correctly excluded.
- OAR021 - ExcludeParameter - Added test coverage confirming that single-resource paths ending with a path parameter (e.g. `/users/{id}`) are correctly excluded from this rule.
- OAR022 - OrderbyParameter - Added test coverage confirming that single-resource paths ending with a path parameter (e.g. `/users/{id}`) with a 206 response are correctly excluded from this rule.
- OAR025 - LimitParameter - Added test coverage confirming that single-resource paths ending with a path parameter (e.g. `/users/{id}`) with a 206 response are correctly excluded from this rule.
- OAR028 - FilterParameter - Added test coverage for excluded paths (`/users/me`, `/users/me/settings`, `/pets/{petId}`, `/status`, `/health`, `/ping`) to `ok-example.js` for both OAP2 and OAP3, verifying the rule does not fire on these endpoints.
- OAR031 - ExamplesCoverage - Per-level configuration via `functionOptions` (`validateResponse`, `validateRequestBody`, `validateParameter`, `validateProperty`), all enabled by default; each level can be disabled independently.


## [1.4.0-beta.6] - 2026-07-13

### Fixed

- OAR014 - ResourceLevelWithinNonSuggestedRange - Added `min-level`/`max-level` support; default changed from `maxDepth: 3` to `min-level: 4` / `max-level: 5`, matching the documented "4 and 5" range and the equivalent Sonar rule.
- OAR038 - StandardCreateResponse - `apq-valid-response-schema` never read its `options` (named `_options`) and hardcoded `'data'` as the only valid top-level property name. Now reads a configurable `data-property` functionOption.
- OAR085 - OpenAPIVersion - used the core `pattern` function with a hardcoded regex; there was no way to express a configurable version list. Replaced with a new function, `apq-valid-openapi-version`, that reads a `valid-versions` functionOption.
- OAR004 - ValidWso2ScopesRoles - `apq-forbidden-characters` ignored its `options` entirely and used a hardcoded regex. Now reads a configurable `pattern` functionOption (default unchanged).
- OAR082 - BinaryOrByteFormat - `apq-spectral.json` was wired to the core `pattern` function against `$..properties.*` instead of `apq-binary-format-check`, which wasn't even registered in its `functions` array. This caused both the reported false positives on unrelated `integer`/`format: int32` properties and the inert `fields-to-apply` option.
- OAR019/OAR020/OAR021 - $select/$expand/$exclude required as a query parameter - replaced the hardcoded exclusion regexes baked into each rule's `given` with a new shared function, `apq-collection-query-param-required`, exposing `parameter-name` (required), `paths`, and `pathValidationStrategy`.


## [1.4.0-beta.5] - 2026-07-08

### Changed

- OAR037 - StringFormat - String schemas must now declare a valid `format`, or a valid `pattern` when no `format` is defined. Aligns with the equivalent security-classified change on the Sonar side (`OAR037StringFormatCheck`).

## [1.4.0-beta.4] - 2026-07-06

### Fixed

- OAR044 - MediaType - Synced the fix into `apq-spectral.json`, which had been missed in 1.4.0-beta.2 (only `apq-spectral.yaml` was updated). The JSON still carried the old regex `^application/[a-zA-Z0-9-_]+$` (rejecting `application/ld+json` and Excel vendor types), a broken `field: "name"`, and a responses-only `given`. Since QA lints against the JSON, valid media types kept being reported as invalid.
- OAR017 - AlternatePaths - Synced the fix into `apq-spectral.json`, which still had `except: ["me","get","search"]` (missing `delete`) while `apq-spectral.yaml` already carried it. Paths such as `/greetings/delete` no longer trigger the rule when linting with the JSON ruleset.


## [1.4.0-beta.3] - 2026-06-25

### Fixed

- OAR028 - FilterParameter - Fixed false positives in `apq-spectral.json`: the JSON ruleset had `given: "$.paths[*].get"` without the exclusion regex that `apq-spectral.yaml` already carried. Updated eliminating spurious findings on `/me` endpoints, detail endpoints ending with `/{id}`, and health-check paths (`status`, `health`, `ping`).

## [1.4.0-beta.2] - 2026-06-24

### Changed

- OAR037 - StringFormat - Rule no longer fires when a string schema omits the `format` field entirely; it only fires when `format` is present but not a recognized value.

### Fixed

- OAR017 - AlternatePaths - Added `delete` to the `except` list (default is now `get,me,search,delete`); paths ending with `/delete` are now treated as pseudo-parameters and no longer trigger the alternation rule.
- OAR044 - MediaType - Fixed overly restrictive regex that rejected valid RFC 6838 media types: vendor-specific types (`application/vnd.ms-excel`, `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`, `application/vnd.github+json`), structured suffixes (`application/ld+json`), non-`application/` families (`text/csv`, `image/png`, `multipart/form-data`), parameterised types (`text/plain; charset=utf-8`), and wildcards (`*/*`, `image/*`). Extended `given` to also validate `requestBody` content.

### Added

- OAR020 - ExpandParameter - Added test coverage confirming that single-resource paths ending with a path parameter (e.g. `/users/{id}`), `/me` paths, and health-check paths are correctly excluded.
- OAR021 - ExcludeParameter - Added test coverage confirming that single-resource paths ending with a path parameter (e.g. `/users/{id}`) are correctly excluded from this rule.
- OAR022 - OrderbyParameter - Added test coverage confirming that single-resource paths ending with a path parameter (e.g. `/users/{id}`) with a 206 response are correctly excluded from this rule.
- OAR025 - LimitParameter - Added test coverage confirming that single-resource paths ending with a path parameter (e.g. `/users/{id}`) with a 206 response are correctly excluded from this rule.
- OAR028 - FilterParameter - Added test coverage for excluded paths (`/users/me`, `/users/me/settings`, `/pets/{petId}`, `/status`, `/health`, `/ping`) to `ok-example.js` for both OAP2 and OAP3, verifying the rule does not fire on these endpoints.

## [1.4.0-beta.1] - 2026-06-15

### Added

- OAR031 - ExamplesCoverage - Per-level configuration via `functionOptions` (`validateResponse`, `validateRequestBody`, `validateParameter`, `validateProperty`), all enabled by default; each level can be disabled independently.

### Changed

- OAR031 - ExamplesCoverage - Levels are now validated **independently**, each with a level-specific message and precise (per-property) reporting location. The response/request-body level requires a body-level example (a media-type `example`/`examples` or a root `schema.example`); per-property examples no longer satisfy it. This is stricter than 1.3.0 and may surface new findings on existing specs — recommend a minor (or major) version bump on release.


## [1.3.0] - 2026-06-04

### Added

- OAR038 - StandardCreateResponse - POST 201 responses must have a schema with a `data` or `error` property, each with at least one sub-property defined
- OAR043 - ParsingError - OpenAPI file cannot be parsed

### Changed

- OAR031 - ExamplesCoverage - Responses, Request Body, Parameters and Properties must have an example defined

### Fixed

- OAR004 - ValidWso2ScopesRoles - Fixed validation for `roles` defined as YAML/JSON array and updated allowed characters pattern
- OAR008 - AllowedHttpVerb - Fixed rule logic replacing incorrect `truthy` check with `falsy` check on forbidden verbs
- OAR014 - ResourceLevelWithinNonSuggestedRange - Fixed depth count to exclude path parameters and special segments
- OAR015 - ResourceLevelMaxAllowed - Fixed false negative for paths composed entirely of path parameters
- OAR017 - AlternatePaths - Fixed false positives and aligned rule message; expanded test coverage
- OAR020 - ExpandParameter - Fixed false negative where GET operations with absent `parameters` block were not detected
- OAR021 - ExcludeParameter - Fixed false negative where GET operations with absent `parameters` block were not detected
- OAR028 - FilterParameter - Fixed rule to report one issue per operation
- OAR031 - ExamplesCoverage - Fixed false positive on schema properties without explicit `type` field; added body-param property check
- OAR037 - StringFormat - Fixed false negative for string schemas without `format` field; added valid formats and excluded `enum` fields
- OAR043 - ParsingError - Updated error messages
- OAR066 - SnakeCaseNamingConvention - Fixed false positives on non-body parameter schema properties and industry-standard name prefixes
- OAR073 - RateLimit - Fixed false positive for health-check paths; extended excluded paths list


## [1.3.0-beta.6] - 2026-06-02

### Fixed

- OAR017 - AlternatePaths - Aligned rule message. Expanded test coverage from 1 to 3 failing cases covering all three violation types: path starting with parameter (`/{id}`), consecutive static segments (`/a/b`), and consecutive path parameters (`/{a}/{b}`).
- OAR028 - FilterParameter - Updated `docs/resources/OAR028.md` to correctly show one issue per operation (not per non-`$filter` parameter), reflecting the actual rule behavior.
- OAR031 - ExamplesCoverage - Fixed false positive where schema properties without an explicit `type` field (e.g. HAL/HATEOAS `_links` sub-properties like `self`, `next`, `previous`) were incorrectly flagged as missing an example. The property-level check now only fires when `type` is explicitly declared, aligning with Sonar's `!type.isMissing()` guard. Body-param property check now also checks properties inside `in: body` parameter schemas.
- OAR066 - SnakeCaseNamingConvention - Fixed false positive where non-body parameter schema properties (query/path/header/cookie params in OAP3) were validated for snake_case. Changed the `given` from `parameters[*]` to `parameters[?(@.in=='body')]` so only OAP2 body parameters are checked.

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
