# KairosLaunch

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)

> **Open-source, configuration-driven deployment orchestrator** that automates the installation of SaaS products from marketplace platforms (Codecanyon, Gumroad, etc.) directly to customer Vercel accounts.

## 🎯 Mission

Convert marketplace buyers into deployed customers in **<5 minutes** with **zero technical friction**.

## 💡 Why KairosLaunch?

SaaS founders face a fundamental dilemma: how to balance marketplace visibility with code security and customer experience. Current distribution models force entrepreneurs to choose between exposing source code publicly, burdening customers with manual installation, or managing complex hosted infrastructure.

**KairosLaunch solves this** by providing secure, automated, one-click deployment that protects your intellectual property while delivering a frictionless customer experience. [Read our complete value proposition →](VALUE_PROPOSITION.md)

**Key Benefits:**
- 🔒 **Code Protection** - Private repositories, never exposed
- ⚡ **80% Less Support** - Automated deployment eliminates installation tickets
- 🚀 **<3 Minute Setup** - From purchase to live deployment
- 🌐 **Open Source** - Community-driven, transparent, extensible

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
npm run db:migrate

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

- **Framework:** Next.js 15 + TypeScript
- **Database:** Vercel Postgres + Drizzle ORM
- **Authentication:** NextAuth.js
- **UI:** shadcn/ui + Tailwind CSS
- **Validation:** Zod

## 📚 Documentation

- [Value Proposition](VALUE_PROPOSITION.md) - Why KairosLaunch? Complete value proposition and benefits
- [Configuration Guide](kairos-launch/docs/configuration.md) - Learn how to configure products
- [API Documentation](kairos-launch/docs/api.md) - API endpoints reference
- [Examples](examples/) - Example product configurations
- [Roadmap](kairos-launch/ROADMAP.md) - Planned features and improvements
- [Contributing Guide](CONTRIBUTING.md) - How to contribute

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

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

