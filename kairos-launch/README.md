# KairosLaunch

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![Stars](https://img.shields.io/github/stars/JavierBaal/kairos-launch?style=social)](https://github.com/JavierBaal/kairos-launch/stargazers)
[![Vercel](https://img.shields.io/badge/Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com)

> **Open-source, configuration-driven deployment orchestrator** that automates the installation of SaaS products from marketplace platforms (Codecanyon, Gumroad, etc.) directly to customer Vercel accounts.

## 🎯 Mission

Convert marketplace buyers into deployed customers in **<5 minutes** with **zero technical friction**.

## 🎬 See it in Action

> **Note:** Demo video/GIF coming soon! The installation wizard guides users through a seamless 5-step process from marketplace purchase to deployed app.

*From marketplace purchase to deployed app in 3 minutes*

## ✨ Features

- ✅ **Multi-Product Support** - Deploy multiple products from a single instance
- ✅ **Marketplace OAuth** - Envato (Codecanyon) integration with automatic license verification
- ✅ **Vercel Deployment** - One-click deployment to customer Vercel accounts
- ✅ **Private Repositories** - Keep source code secure and never exposed
- ✅ **License Validation** - Automatic verification at every step
- ✅ **Configuration-Driven** - Works for any SaaS product via JSON config
- ✅ **Open Source** - Community-driven and transparent

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Vercel account
- GitHub account

### Installation

```bash
# Clone the repository
git clone https://github.com/JavierBaal/kairos-launch.git
cd kairos-launch

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Set up Vercel Postgres database
# Follow Vercel dashboard instructions to create Postgres database

# Run database migrations
npm run db:push

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 📖 Usage

### 1. Create Product Configuration

Create a JSON config file in the `configs/` directory:

```json
{
  "product": {
    "id": "my-product",
    "name": "My Awesome Product",
    "description": "A great SaaS product",
    "logo": "https://example.com/logo.png"
  },
  "marketplace": {
    "platform": "codecanyon",
    "itemId": "12345678"
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
    "framework": "nextjs"
  }
}
```

### 2. Deploy to Vercel

```bash
vercel deploy
```

### 3. Share Installation URL

Share the installation URL with your customers:
```
https://your-installer.vercel.app/install/my-product
```

## 🏗️ Architecture

KairosLaunch is built with:

- **Framework:** Next.js 16 + TypeScript
- **Database:** Vercel Postgres + Drizzle ORM
- **Authentication:** NextAuth.js v5
- **UI:** shadcn/ui + Tailwind CSS
- **Validation:** Zod

## 📚 Documentation

- [Configuration Guide](./docs/configuration.md) - Learn how to configure products
- [API Documentation](./docs/api.md) - API endpoints reference
- [Examples](../examples/) - Example product configurations
- [Roadmap](./ROADMAP.md) - Planned features and improvements
- [Contributing Guide](../CONTRIBUTING.md) - How to contribute

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](../CONTRIBUTING.md) for details.

**Looking for your first contribution?** Check out issues labeled [`good first issue`](https://github.com/JavierBaal/kairos-launch/labels/good%20first%20issue).

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🗺️ Roadmap

See our [Roadmap](ROADMAP.md) for planned features and improvements. Current focus:
- **v1.0.0:** Stable release with Envato support
- **v1.1.0:** Gumroad and Lemon Squeezy integration
- **v1.2.0:** Analytics dashboard and monitoring
- **v2.0.0:** Plugin system for extensibility

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

## 👤 Author

**Javier Baal**

- GitHub: [@JavierBaal](https://github.com/JavierBaal)
- Twitter/X: [@javierbaal00](https://x.com/javierbaal00)
- Reddit: [u/JFerzt](https://www.reddit.com/user/JFerzt/)

## 🙏 Acknowledgments

- Built with ❤️ for the open-source community
- Inspired by the need for secure, automated SaaS distribution

---

Made with ❤️ by [Javier Baal](https://github.com/JavierBaal)
