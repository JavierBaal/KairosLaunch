# Contributing to KairosLaunch

First off, thank you for considering contributing to KairosLaunch! It's people like you that make KairosLaunch such a great tool.

## Code of Conduct

This project adheres to a Code of Conduct that all contributors are expected to follow. Please read [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) before contributing.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples to demonstrate the steps**
- **Describe the behavior you observed after following the steps**
- **Explain which behavior you expected to see instead and why**
- **Include screenshots and animated GIFs if applicable**

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- **Use a clear and descriptive title**
- **Provide a step-by-step description of the suggested enhancement**
- **Provide specific examples to demonstrate the steps**
- **Describe the current behavior and explain which behavior you expected to see instead**
- **Explain why this enhancement would be useful**

### Pull Requests

- Fill in the required template
- Do not include issue numbers in the PR title
- Include screenshots and animated GIFs in your pull request whenever possible
- Follow the TypeScript and React styleguides
- Include thoughtfully-worded, well-structured tests
- Document new code based on the Documentation Styleguide
- End all files with a newline

## Development Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- Git
- Vercel account (for database)

### Getting Started

1. Fork and clone the repository
   ```bash
   git clone https://github.com/YOUR_USERNAME/kairos-launch.git
   cd kairos-launch
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your credentials
   ```

4. Set up Vercel Postgres database
   - Create a Postgres database in Vercel dashboard
   - The `POSTGRES_URL` will be automatically provided

5. Run database migrations
   ```bash
   npm run db:migrate
   ```

6. Start the development server
   ```bash
   npm run dev
   ```

## Development Process

1. Create a branch from `main`
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes
   - Write clean, readable code
   - Add tests for new features
   - Update documentation as needed

3. Commit your changes
   ```bash
   git commit -m "feat: add amazing feature"
   ```
   Follow [Conventional Commits](https://www.conventionalcommits.org/) format.

4. Push to your fork
   ```bash
   git push origin feature/your-feature-name
   ```

5. Create a Pull Request
   - Fill out the PR template
   - Reference any related issues
   - Request review from maintainers

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Enable strict mode
- Avoid `any` types
- Use meaningful variable names

### Code Style

- Use Prettier for formatting
- Follow ESLint rules
- Write self-documenting code
- Add comments for complex logic

### Testing

- Write tests for new features
- Maintain >80% code coverage
- Test error scenarios
- Use descriptive test names

## Project Structure

```
kairos-launch/
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/        # React components
│   ├── lib/              # Utility functions
│   └── types/            # TypeScript types
├── configs/              # Product configuration files
├── drizzle/              # Database schema and migrations
└── docs/                 # Documentation
```

## Questions?

Feel free to open an issue for any questions you might have.

Thank you for contributing! 🎉

