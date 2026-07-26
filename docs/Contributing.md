# Contributing to PrivyMint

We welcome contributions from open-source developers, smart contract engineers, and Midnight ecosystem builders!

## Development Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/privymint/privymint.git
   cd PrivyMint
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Compile Compact Smart Contracts**:
   ```bash
   npm run contract:check
   ```

4. **Start local development servers**:
   ```bash
   # Start API server
   npm run dev:api

   # Start Web app
   npm run dev
   ```

5. **Run test suite**:
   ```bash
   npm run test
   ```

## Commit Conventions

We follow the Conventional Commits specification:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `test:` Test updates
- `refactor:` Code refactoring
- `ci:` CI pipeline changes

## Pull Request Guidelines

1. Ensure all TypeScript checks pass (`npm run typecheck`).
2. Ensure Compact contract compiles cleanly (`npm run contract:check`).
3. Ensure all tests pass (`npm run test`).
4. Include a concise summary of your changes in the PR description.
