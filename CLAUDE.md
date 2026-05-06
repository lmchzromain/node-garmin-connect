# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Node.js library for interacting with Garmin Connect. It exposes:

- **Authentication** — Garmin SSO/OAuth flow, with token persistence to avoid re-logging in.
- **Data fetching** — functions to retrieve user data from Garmin Connect (activities, health, sleep, …), ported from [python-garminconnect](https://github.com/cyberjunky/python-garminconnect).

The package is designed to be consumed by other projects. It returns raw data — serialization and storage are the caller's responsibility.

## Commands

```bash
npm install        # Install dependencies
npm run lint       # ESLint
npm run format     # Prettier
node test.js       # Manual auth smoke test
```

## Code Style

- **No TypeScript** — plain JavaScript only.
- **Functional programming** — prefer `const`, pure functions, and immutable data.
- **No `for` loops** — use `map`, `filter`, `reduce`, `flatMap`, etc.
- **No default exports** — always use named exports.
- **One file per component** — small, focused modules.
- **No defensive clutter** — avoid unnecessary null guards, try/catch, or safety checks beyond system boundaries (user input, HTTP responses).
- English in all code, comments, and commit messages.

## Architecture

```
src/
  auth/      # Garmin SSO / OAuth flow + token persistence
  api/       # One file per data domain (activities, health, sleep, …)
  utils/     # Shared pure helpers
index.js     # Public API
test.js      # Manual smoke test (not shipped)
```

Authentication goes through Garmin's SSO flow (CSRF token → login → OAuth 1.0a → OAuth 2.0 Bearer token). Tokens are persisted to `.garmin-tokens.json` and refreshed automatically — a full SSO login only happens when no valid token exists.

Each file in `src/api/` exports functions that accept the OAuth2 token and return raw fetched data — no class instances, no shared mutable state.
