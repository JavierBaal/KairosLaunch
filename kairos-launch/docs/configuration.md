# Configuration Guide

Learn how to configure products for deployment with KairosLaunch.

## Overview

KairosLaunch uses JSON configuration files to define product-specific deployment settings. Each product requires a configuration file in the `configs/` directory.

## Configuration File Structure

Configuration files must be named `{product-id}.config.json` and placed in the `configs/` directory.

### Example

```json
{
  "product": {
    "id": "my-product",
    "name": "My Awesome Product",
    "description": "A great SaaS product",
    "logo": "https://example.com/logo.png",
    "version": "1.0.0"
  },
  "marketplace": {
    "platform": "codecanyon",
    "itemId": "12345678",
    "authorUsername": "your-username"
  },
  "repository": {
    "provider": "github",
    "owner": "your-org",
    "repo": "my-product-private",
    "branch": "main",
    "isPrivate": true
  },
  "deployment": {
    "platform": "vercel",
    "framework": "nextjs",
    "buildCommand": "npm run build",
    "outputDirectory": ".next",
    "installCommand": "npm install",
    "requiredEnvVars": []
  },
  "validation": {
    "endpoint": "https://api.example.com/validate",
    "method": "POST"
  }
}
```

## Configuration Schema

### Product Section

```json
{
  "product": {
    "id": "string",           // Required: Unique product identifier (used in URLs)
    "name": "string",         // Required: Display name
    "description": "string", // Optional: Product description
    "logo": "string",         // Optional: URL to product logo
    "version": "string"       // Optional: Product version
  }
}
```

**Fields:**
- `id`: Must be lowercase, alphanumeric with hyphens (e.g., `my-product`, `saas-template`)
- `name`: Human-readable product name
- `description`: Shown on landing page
- `logo`: Full URL to logo image (recommended: 512x512px)
- `version`: Semantic version (e.g., `1.0.0`)

### Marketplace Section

```json
{
  "marketplace": {
    "platform": "codecanyon" | "gumroad" | "lemon-squeezy",
    "itemId": "string",        // Required: Marketplace item ID
    "authorUsername": "string" // Optional: Your marketplace username
  }
}
```

**Supported Platforms:**
- `codecanyon` - Envato Codecanyon (currently supported)
- `gumroad` - Gumroad (coming in v1.1.0)
- `lemon-squeezy` - Lemon Squeezy (coming in v1.1.0)

**Fields:**
- `platform`: Marketplace platform identifier
- `itemId`: Unique item ID from marketplace (e.g., Codecanyon item number)
- `authorUsername`: Your marketplace username (for display purposes)

### Repository Section

```json
{
  "repository": {
    "provider": "github",
    "owner": "string",    // Required: GitHub organization or username
    "repo": "string",     // Required: Repository name
    "branch": "string",   // Optional: Default "main"
    "isPrivate": boolean  // Required: Must be true for security
  }
}
```

**Important:** The repository **must** be private. KairosLaunch uses a backend GitHub token to access private repositories securely.

**Fields:**
- `provider`: Currently only `github` is supported
- `owner`: GitHub organization or username that owns the repository
- `repo`: Repository name (without `.git` extension)
- `branch`: Git branch to deploy (default: `main`)
- `isPrivate`: Must be `true` - public repositories are not supported for security

### Deployment Section

```json
{
  "deployment": {
    "platform": "vercel",
    "framework": "string",           // Optional: Framework detection
    "buildCommand": "string",        // Optional: Custom build command
    "outputDirectory": "string",     // Optional: Build output directory
    "installCommand": "string",     // Optional: Custom install command
    "requiredEnvVars": [             // Optional: Environment variables
      {
        "key": "string",
        "value": "string",
        "userInput": boolean,
        "required": boolean,
        "description": "string",
        "validation": {
          "type": "regex" | "length" | "url" | "email",
          "pattern": "string",
          "minLength": number,
          "maxLength": number
        }
      }
    ]
  }
}
```

**Fields:**
- `platform`: Currently only `vercel` is supported
- `framework`: Framework identifier (e.g., `nextjs`, `react`, `vue`)
- `buildCommand`: Custom build command (default: framework-specific)
- `outputDirectory`: Build output directory (e.g., `.next`, `dist`, `build`)
- `installCommand`: Custom install command (default: `npm install`)
- `requiredEnvVars`: Array of environment variable definitions

#### Environment Variables

Environment variables can be:
1. **Auto-injected**: System variables (LICENSE_KEY, USER_EMAIL, PRODUCT_ID)
2. **Template-based**: Variables with placeholders (e.g., `{{PURCHASE_CODE}}`)
3. **User-provided**: Variables that users enter during installation

**Variable Object:**
```json
{
  "key": "DATABASE_URL",              // Required: Variable name
  "value": "{{PURCHASE_CODE}}",       // Optional: Default/template value
  "userInput": true,                  // Optional: User can provide (default: false)
  "required": false,                  // Optional: Required if userInput (default: false)
  "description": "PostgreSQL URL",    // Optional: Help text for users
  "validation": {                     // Optional: Validation rules
    "type": "url",
    "pattern": "^https?://",
    "minLength": 10,
    "maxLength": 500
  }
}
```

**Placeholders:**
- `{{PURCHASE_CODE}}` - Replaced with Envato purchase code
- `{{USER_EMAIL}}` - Replaced with buyer's email
- `{{PRODUCT_ID}}` - Replaced with product ID
- `{{DEPLOYMENT_URL}}` - Replaced with final deployment URL

**Validation Types:**
- `regex` - Validate against regex pattern
- `length` - Validate string length (use `minLength`/`maxLength`)
- `url` - Validate URL format
- `email` - Validate email format

### Validation Section (Optional)

```json
{
  "validation": {
    "endpoint": "https://api.example.com/validate",
    "method": "GET" | "POST" | "PUT"
  }
}
```

**Fields:**
- `endpoint`: Custom validation endpoint URL
- `method`: HTTP method for validation request

## Complete Example

See the [examples directory](../examples/) for complete configuration examples:
- [Next.js SaaS Template](../examples/nextjs-saas/)
- [WordPress Plugin](../examples/wordpress-plugin/)
- [Strapi Backend](../examples/strapi-backend/)

## Validation

KairosLaunch validates configuration files using Zod schemas. Invalid configurations will show clear error messages indicating what needs to be fixed.

### Common Validation Errors

1. **Missing required fields**: Ensure all required fields are present
2. **Invalid product ID**: Must be lowercase, alphanumeric with hyphens
3. **Invalid marketplace platform**: Must be one of the supported platforms
4. **Public repository**: `isPrivate` must be `true`
5. **Invalid environment variable key**: Keys must be valid environment variable names

## Best Practices

### Product ID Naming

- Use lowercase letters, numbers, and hyphens only
- Keep it short and descriptive
- Examples: `my-saas`, `wp-plugin-pro`, `nextjs-template`

### Environment Variables

- **System variables** (LICENSE_KEY, USER_EMAIL, PRODUCT_ID) are automatically injected
- Use **placeholders** for dynamic values
- Mark **optional** variables clearly with `required: false`
- Provide **descriptions** for user-provided variables

### Security

- Always use **private repositories**
- Never expose sensitive values in configuration files
- Use **environment variables** for secrets
- Validate user input with appropriate validation rules

## Loading Configurations

Configurations are automatically loaded from the `configs/` directory when KairosLaunch starts. The installation URL format is:

```
https://your-installer.vercel.app/install/{product-id}
```

Where `{product-id}` matches the `product.id` in your configuration file.

## Multiple Products

You can deploy multiple products from a single KairosLaunch instance by adding multiple configuration files:

```
configs/
├── product-a.config.json
├── product-b.config.json
└── product-c.config.json
```

Each product will have its own installation URL and isolated configuration.

## Troubleshooting

### Configuration Not Loading

- Verify file is named `{product-id}.config.json`
- Check file is in `configs/` directory
- Validate JSON syntax (use a JSON validator)
- Check for validation errors in logs

### Environment Variables Not Injecting

- Verify variable key is correct
- Check placeholder syntax (`{{PLACEHOLDER}}`)
- Ensure `userInput: false` for auto-injected variables
- Review deployment logs for errors

### Deployment Failing

- Verify repository access with GitHub token
- Check Vercel OAuth permissions
- Review environment variable requirements
- Check build command and output directory

## Need Help?

- Check the [examples](../examples/) for reference configurations
- Open an [issue](https://github.com/JavierBaal/kairos-launch/issues) for support
- Review the [API Documentation](./api.md) for technical details

