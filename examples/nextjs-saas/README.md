# Next.js SaaS Template Example

This is an example configuration for deploying a Next.js SaaS application using KairosLaunch.

## Configuration Overview

- **Framework:** Next.js with TypeScript
- **Database:** PostgreSQL (optional, user-provided)
- **Deployment:** Vercel
- **Marketplace:** Codecanyon

## Setup Instructions

1. Copy `product.config.json` to your `configs/` directory
2. Update the `marketplace.itemId` with your Codecanyon item ID
3. Update the `repository` section with your private GitHub repository details
4. Deploy KairosLaunch to Vercel
5. Share the installation URL with your customers

## Environment Variables

- `LICENSE_KEY` - Automatically injected from purchase code
- `DATABASE_URL` - Optional, user can provide during installation
- `NEXT_PUBLIC_APP_URL` - Automatically set to deployment URL

## Customization

You can customize the configuration by:
- Adding more environment variables
- Changing the build command
- Adding validation endpoints
- Customizing deployment settings

