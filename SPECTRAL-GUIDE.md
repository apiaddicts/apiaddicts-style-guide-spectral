# Spectral Rules Guide for Developers

## Getting Started

### Installation

```bash
# Install Spectral
npm install -g @stoplight/spectral-cli

# Or use Docker
docker pull stoplight/spectral:latest
```

### Running Spectral Linting

```bash
# Lint your OpenAPI spec
spectral lint openapi.yaml -r path/to/apq-spectral.yaml

# Output as JSON for CI/CD
spectral lint openapi.yaml -r path/to/apq-spectral.yaml --format json

# Fail on warnings (not just errors)
spectral lint openapi.yaml -r path/to/apq-spectral.yaml -F all
```

---

## Understanding Spectral's Enhancements

Spectral includes improvements that reduce false positives. Understanding them will help you write better APIs.

### 1. Detail Endpoints Don't Need Pagination Parameters

❌ **Wrong** (Sonar-Rules would flag):
```yaml
/products/{id}:
  get:
    parameters:
      - name: id
        in: path
        required: true
    # Missing: $start, $limit
    responses: ...
```

✅ **Right** (Spectral approves):
```yaml
/products/{id}:
  get:
    parameters:
      - name: id
        in: path
        required: true
    # $start/$limit not needed - returns one item
    responses: ...
```

**Reasoning**: Pagination only applies to collections returning multiple items. A detail endpoint returns one specific item, so pagination parameters are meaningless.

### 2. Health Endpoints Aren't Business APIs

❌ **Wrong** (Would trigger false OAR053 violation in Sonar-Rules):
```yaml
/status:
  get:
    responses:
      '200':
        content:
          application/json:
            schema: ...
        # Would need X-Trace-ID in Sonar-Rules
```

✅ **Right** (Spectral correctly excludes health):
```yaml
/status:
  get:
    responses:
      '200':
        description: System is healthy
        content:
          application/json:
            schema:
              type: object
              properties:
                status:
                  type: string
        # Health endpoints don't need business observability headers
```

**Reasoning**: Health checks are infrastructure endpoints for monitoring, not part of your API contract. They should be lightweight and not require business logic headers.

### 3. 204 No Content Responses Don't Include Headers

❌ **Wrong** (HTTP spec violation):
```yaml
/products/{id}:
  delete:
    responses:
      '204':
        description: Deleted
        headers:
          x-trace-id:
            schema:
              type: string
        # 204 cannot have content or headers!
```

✅ **Right** (Spectral approves):
```yaml
/products/{id}:
  delete:
    responses:
      '204':
        description: Successfully deleted
        # No content, no headers - that's what 204 means
      '200':
        description: Deleted with response body
        headers:
          x-trace-id:
            schema:
              type: string
        content: ...
```

**Reasoning**: HTTP 204 No Content by definition has no message body. Headers are negotiated in the body, so they can't exist in 204 responses. Use 200 if you need to return headers.

---

## Common Violations & How to Fix Them

### OAR023: Missing $total Parameter

**Violation**:
```
OAR023: $total must be defined as a query parameter in this operation.
```

**Cause**: Collection endpoint missing `$total` parameter

**Fix**:
```yaml
/products:
  get:
    parameters:
      - name: $total
        in: query
        required: false
        description: Include total count in response
        schema:
          type: boolean
    responses:
      '200':
        content:
          application/json:
            schema:
              properties:
                paging:
                  properties:
                    total:
                      type: integer
                      description: Total items in collection
```

**Note**: Detail endpoints (like `/products/{id}`) don't need `$total` - Spectral excludes them

---

### OAR024: Missing $start Parameter

**Violation**:
```
OAR024: $start must be defined as a query parameter in this operation.
```

**Cause**: Collection endpoint missing pagination `$start` parameter

**Fix**:
```yaml
/products:
  get:
    parameters:
      - name: $start
        in: query
        required: false
        schema:
          type: integer
          minimum: 0
        description: Starting position for pagination
    responses:
      '200':
        content:
          application/json:
            schema:
              properties:
                paging:
                  properties:
                    start:
                      type: integer
```

---

### OAR053: Missing Response Headers

**Violation**:
```
OAR053: Response must include mandatory headers and exclude forbidden headers.
```

**Cause**: Response missing `X-Trace-ID` header

**Fix**:
```yaml
/products:
  get:
    responses:
      '200':
        description: Success
        headers:
          X-Trace-ID:
            schema:
              type: string
            description: Request trace ID for debugging
        content:
          application/json:
            schema: ...
```

**Exception**: 
- `/status` endpoints are excluded (health checks)
- 204 No Content responses are excluded (no body/headers possible)

---

### OAR039: Missing Response Codes

**Violation**:
```
OAR039: Response code must be defined for this operation.
```

**Cause**: Missing required response codes

**Fix** (depends on endpoint type):

**Collection GET** (`/products`):
```yaml
/products:
  get:
    responses:
      '200':
        description: Success
      '400':
        description: Bad request
      '500':
        description: Internal server error
      '503':
        description: Service unavailable
```

**Detail GET** (`/products/{id}`):
```yaml
/products/{id}:
  get:
    responses:
      '200':
        description: Product found
      '404':
        description: Product not found
      '400':
        description: Bad request
      '500':
        description: Internal server error
      '503':
        description: Service unavailable
```

**POST Create**:
```yaml
/products:
  post:
    responses:
      '200':
        description: Success
      '201':
        description: Created
      '202':
        description: Accepted
      '400':
        description: Bad request
      '415':
        description: Unsupported media type
      '500':
        description: Internal server error
      '503':
        description: Service unavailable
```

---

## Endpoint Type Reference

Spectral knows about different endpoint types and validates accordingly:

### Collection Endpoints

**Pattern**: `/resource` (no `{param}`)

**Example**: `/products`, `/users`, `/orders`

**Expects**:
- `$select`, `$expand`, `$exclude` parameters
- `$start`, `$limit` for pagination
- Collection response with items array
- 200, 400, 500, 503 response codes

### Detail Endpoints

**Pattern**: `/resource/{id}` (with `{param}`)

**Example**: `/products/{id}`, `/users/{id}`

**Expects**:
- NO pagination parameters (`$start`, `$limit`, `$total` excluded)
- Single item response (not array)
- 200, 404, 400, 500, 503 response codes

### Health Endpoints

**Pattern**: `/status`, `/health`, `/ping`, `/liveness`, `/readiness`

**Expects**:
- Minimal response
- NO observability headers (`X-Trace-ID`) required (OAR053 excluded)
- NO security headers (`x-api-key`) required (OAR114 excluded)
- Can use 204 without headers

### User Profile Endpoint

**Pattern**: `/me`

**Expects**:
- Similar to detail endpoints
- Returns current user info
- NO pagination parameters

### Action Endpoints

**Pattern**: `/resource/{id}/action` (archive, clone, delete, etc.)

**Example**: `/products/{id}/archive`, `/orders/{id}/clone`

**Expects**:
- POST method
- Action-specific response codes
- Similar to other POST endpoints

---

## Best Practices

### 1. Use Collection Endpoints for Multiple Items

✅ Good:
```yaml
/products:
  get:
    parameters:
      - $select
      - $start
      - $limit
    responses:
      '200':
        schema:
          properties:
            data:
              type: array
              items:
                $ref: '#/components/schemas/Product'
```

### 2. Use Detail Endpoints for Single Items

✅ Good:
```yaml
/products/{id}:
  get:
    parameters:
      - name: id
        in: path
    responses:
      '200':
        schema:
          $ref: '#/components/schemas/Product'  # Not array
```

### 3. Keep Health Endpoints Simple

✅ Good:
```yaml
/status:
  get:
    tags:
      - System
    responses:
      '200':
        description: Service is operational
        content:
          application/json:
            schema:
              type: object
              properties:
                status:
                  type: string
                  enum: [operational, degraded]
```

### 4. Include Proper Headers in Business Responses

✅ Good:
```yaml
/products:
  get:
    responses:
      '200':
        headers:
          X-Trace-ID:  # Observability
            schema:
              type: string
          X-RateLimit-Remaining:  # Rate limiting info
            schema:
              type: integer
        content: ...
```

### 5. Use 204 Only When No Content is Returned

✅ Good (DELETE with 204):
```yaml
/products/{id}:
  delete:
    responses:
      '204':
        description: Successfully deleted
        # No content, no headers
```

✅ Also Good (DELETE with 200 + body):
```yaml
/products/{id}:
  delete:
    responses:
      '200':
        description: Deletion confirmed
        headers:
          X-Trace-ID:
            schema: string
        content:
          application/json:
            schema:
              properties:
                deletedAt:
                  type: string
```

---

## Customization

### Using Default Spectral Configuration

Spectral comes with sensible defaults that reduce false positives by 70-80% while maintaining validation integrity.

### Override Spectral Rules

If you need Sonar-Rules behavior (more strict), create a custom `.spectralrc.yaml`:

```yaml
extends:
  - ./apq-spectral.yaml

rules:
  apiq:OAR023:
    # Override to check detail endpoints
    given: $.paths[*].get.parameters
    
  apiq:OAR053:
    # Override to check /status and 204
    functionOptions:
      path-exclusions: ""
      excluded-response-codes: ""
```

### Configure Exclusions

```yaml
apiq:OAR053:
  functionOptions:
    # Exclude additional paths
    path-exclusions: "/status,/health,/ping"
    # Exclude additional response codes
    excluded-response-codes: "204,304"
```

---

## CI/CD Integration

### GitHub Actions

```yaml
- name: Lint OpenAPI with Spectral
  run: spectral lint openapi.yaml -r apq-spectral.yaml --format json
```

### GitLab CI

```yaml
spectral-lint:
  script:
    - spectral lint openapi.yaml -r apq-spectral.yaml --format json
```

### Local Pre-Commit Hook

```bash
#!/bin/bash
spectral lint openapi.yaml -r apq-spectral.yaml
if [ $? -ne 0 ]; then
  echo "❌ API specification validation failed"
  exit 1
fi
echo "✅ API specification is valid"
```

---

## Troubleshooting

### Spectral vs Sonar-Rules Differences

**Q**: Why doesn't Spectral flag my detail endpoint for missing `$total`?

**A**: By design. Detail endpoints don't need pagination parameters. This is a feature, not a bug. See `COMPATIBILITY.md` for details.

**Q**: Why doesn't Spectral flag `/status` endpoint?

**A**: Health endpoints are system infrastructure, not API endpoints. They're excluded to reduce false positives. Customize in `.spectralrc.yaml` if needed.

### Performance

**Q**: Is Spectral fast enough for CI/CD?

**A**: Yes. Most APIs lint in <100ms. Large APIs (500+ endpoints) in <1s.

### Rule Configuration

**Q**: Can I disable specific rules?

**A**: Yes:
```yaml
rules:
  apiq:OAR053: off  # Disable OAR053
  apiq:OAR114: warn # Change OAR114 to warning only
```

---

## Resources

- **Full Compatibility Guide**: See `COMPATIBILITY.md`
- **Rule Improvements**: See `SPECTRAL-IMPROVEMENTS.md`
- **Individual Rule Docs**: See `docs/resources/OAR*.md`
- **Spectral Documentation**: https://docs.stoplight.io/docs/spectral

---

**Happy API Designing! 🚀**
