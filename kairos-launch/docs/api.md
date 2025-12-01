# API Documentation

Complete API reference for KairosLaunch endpoints.

## Base URL

All API endpoints are relative to your deployment URL:

```
https://your-installer.vercel.app/api
```

## Authentication

Most endpoints require authentication via NextAuth session cookies. OAuth flows are handled automatically through NextAuth providers.

## Endpoints

### Authentication

#### `GET /api/auth/[...nextauth]`

NextAuth.js authentication endpoint. Handles OAuth flows for Envato and Vercel.

**Query Parameters:**
- `callbackUrl` - Optional redirect URL after authentication

**Response:**
- Redirects to OAuth provider or callback URL

---

### License Verification

#### `POST /api/verify/license`

Verify user's license for a specific product.

**Authentication:** Required (Envato session)

**Request Body:**
```json
{
  "itemId": "12345678"
}
```

**Response (Success):**
```json
{
  "verified": true,
  "cached": false
}
```

**Response (Error):**
```json
{
  "verified": false,
  "error": "License verification failed"
}
```

**Status Codes:**
- `200` - License verified
- `401` - Unauthorized (no session)
- `403` - License not found or invalid
- `500` - Internal server error

**Example:**
```bash
curl -X POST https://your-installer.vercel.app/api/verify/license \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=..." \
  -d '{"itemId": "12345678"}'
```

---

### Deployment

#### `POST /api/deploy/start`

Start a new deployment for a product.

**Authentication:** Required (Vercel session)

**Request Body:**
```json
{
  "productId": "my-product",
  "purchaseCode": "abc123def456",
  "userEnvVars": {
    "DATABASE_URL": "postgresql://...",
    "API_KEY": "secret-key"
  }
}
```

**Response (Success):**
```json
{
  "success": true,
  "installationId": "xyz789",
  "projectId": "prj_abc123",
  "projectName": "my-product-abc123"
}
```

**Response (Error):**
```json
{
  "error": "Failed to start deployment",
  "message": "Vercel project creation failed"
}
```

**Status Codes:**
- `200` - Deployment started successfully
- `400` - Invalid request (missing productId or purchaseCode)
- `401` - Unauthorized (Vercel not connected)
- `500` - Internal server error

**Example:**
```bash
curl -X POST https://your-installer.vercel.app/api/deploy/start \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=..." \
  -d '{
    "productId": "my-product",
    "purchaseCode": "abc123def456"
  }'
```

---

#### `GET /api/deploy/status`

Get deployment status or poll until completion.

**Authentication:** Required (Vercel session)

**Query Parameters:**
- `deploymentId` - Vercel deployment ID (required)
- `installationId` - Installation record ID (optional)
- `poll` - Set to `true` to poll until completion (optional)

**Response (Single Check):**
```json
{
  "deploymentId": "dpl_abc123",
  "status": "building",
  "url": "https://my-product-abc123.vercel.app",
  "progress": 60
}
```

**Response (Polling - Complete):**
```json
{
  "deploymentId": "dpl_abc123",
  "status": "ready",
  "url": "https://my-product-abc123.vercel.app",
  "progress": 100
}
```

**Response (Error):**
```json
{
  "deploymentId": "dpl_abc123",
  "status": "error",
  "error": "Deployment failed"
}
```

**Status Values:**
- `pending` - Deployment queued or initializing
- `building` - Deployment in progress
- `ready` - Deployment completed successfully
- `error` - Deployment failed

**Status Codes:**
- `200` - Status retrieved successfully
- `400` - Missing deploymentId parameter
- `401` - Unauthorized
- `500` - Internal server error

**Example (Single Check):**
```bash
curl "https://your-installer.vercel.app/api/deploy/status?deploymentId=dpl_abc123" \
  -H "Cookie: next-auth.session-token=..."
```

**Example (Polling):**
```bash
curl "https://your-installer.vercel.app/api/deploy/status?deploymentId=dpl_abc123&poll=true" \
  -H "Cookie: next-auth.session-token=..."
```

---

### Installations

#### `GET /api/installations`

Get installation records for analytics and tracking.

**Authentication:** Required

**Query Parameters:**
- `productId` - Filter by product ID (optional)
- `purchaseCode` - Filter by purchase code (optional)

**Response:**
```json
{
  "installations": [
    {
      "id": "xyz789",
      "productId": "my-product",
      "purchaseCode": "abc123def456",
      "userEmail": "user@example.com",
      "vercelDeploymentUrl": "https://my-product-abc123.vercel.app",
      "vercelProjectId": "prj_abc123",
      "status": "success",
      "errorMessage": null,
      "metadata": {
        "projectName": "my-product-abc123"
      },
      "createdAt": "2025-12-01T10:00:00Z",
      "updatedAt": "2025-12-01T10:05:00Z"
    }
  ]
}
```

**Status Codes:**
- `200` - Installations retrieved successfully
- `400` - Missing productId or purchaseCode
- `401` - Unauthorized
- `500` - Internal server error

**Example:**
```bash
curl "https://your-installer.vercel.app/api/installations?productId=my-product" \
  -H "Cookie: next-auth.session-token=..."
```

---

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "error": "Error message",
  "message": "Detailed error description (optional)"
}
```

### Common Error Codes

- `400 Bad Request` - Invalid request parameters
- `401 Unauthorized` - Authentication required or failed
- `403 Forbidden` - License verification failed or insufficient permissions
- `404 Not Found` - Resource not found
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error

---

## Rate Limiting

API endpoints are rate-limited to prevent abuse:

- **License Verification:** 10 requests per minute per user
- **Deployment Start:** 5 requests per minute per user
- **Status Checks:** 30 requests per minute per user

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 9
X-RateLimit-Reset: 1638360000
```

---

## Webhooks (Coming in v1.2.0)

Webhook events will be sent to configured endpoints:

### `on_install_complete`

Sent when installation completes successfully.

**Payload:**
```json
{
  "event": "on_install_complete",
  "installationId": "xyz789",
  "productId": "my-product",
  "purchaseCode": "abc123def456",
  "userEmail": "user@example.com",
  "deploymentUrl": "https://my-product-abc123.vercel.app",
  "timestamp": "2025-12-01T10:05:00Z"
}
```

### `on_install_failed`

Sent when installation fails.

**Payload:**
```json
{
  "event": "on_install_failed",
  "installationId": "xyz789",
  "productId": "my-product",
  "userEmail": "user@example.com",
  "error": "Deployment failed: Build error",
  "timestamp": "2025-12-01T10:05:00Z"
}
```

### `on_license_invalid`

Sent when license verification fails.

**Payload:**
```json
{
  "event": "on_license_invalid",
  "productId": "my-product",
  "userEmail": "user@example.com",
  "itemId": "12345678",
  "timestamp": "2025-12-01T10:00:00Z"
}
```

---

## SDK Usage (Future)

A JavaScript/TypeScript SDK is planned for programmatic access:

```typescript
import { KairosLaunch } from '@kairoslaunch/sdk';

const client = new KairosLaunch({
  apiUrl: 'https://your-installer.vercel.app',
  apiKey: 'your-api-key'
});

// Start deployment
const deployment = await client.deployments.start({
  productId: 'my-product',
  purchaseCode: 'abc123'
});

// Check status
const status = await client.deployments.status(deployment.id);

// Get installations
const installations = await client.installations.list({
  productId: 'my-product'
});
```

---

## Testing

### Local Development

When running locally (`npm run dev`), API endpoints are available at:

```
http://localhost:3000/api
```

### Testing with curl

Example authentication flow:

```bash
# 1. Start OAuth flow (redirects to provider)
curl -L "http://localhost:3000/api/auth/signin/envato"

# 2. After OAuth callback, use session cookie
curl -X POST "http://localhost:3000/api/verify/license" \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=..." \
  -d '{"itemId": "12345678"}'
```

---

## Support

For API support:
- Open an [issue](https://github.com/JavierBaal/kairos-launch/issues)
- Check the [Configuration Guide](./configuration.md)
- Review [examples](../examples/) for usage patterns

---

**Last Updated:** December 2025

