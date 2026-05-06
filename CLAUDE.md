# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Node.js library that fetches data from Garmin Connect and writes it as JSON files (e.g. `activities.json`, `health-daily.json`). Authentication is modeled after [garmin-connect](https://github.com/florianpasteur/garmin-connect), with data-fetching functions ported from [python-garminconnect](https://github.com/cyberjunky/python-garminconnect).

The package is designed to be consumed by other projects. The caller supplies the output directory; this library only handles fetching and serializing the data.

## Commands

```bash
npm install        # Install dependencies
npm run lint       # ESLint
npm run format     # Prettier
npm test           # Run all tests
npm test -- <file> # Run a single test file
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
  auth/      # Garmin SSO / OAuth authentication flow
  api/       # One file per Garmin Connect endpoint category (activities, health, sleep, …)
  writers/   # One file per output JSON (activities.json, health-daily.json, …)
  utils/     # Shared pure helpers (request, date formatting, …)
index.js     # Public API — re-exports from src/
```

Authentication goes through Garmin's SSO flow (CSRF token → login → OAuth token exchange). The resulting session/token is passed explicitly into each API call rather than stored in global state.

Each file in `src/api/` exports a set of functions that accept a session object and return raw fetched data — no class instances, no shared mutable state.

Each file in `src/writers/` exports a function with the signature `(data, outputDir) => Promise<void>` that serializes the relevant data and writes the corresponding `.json` file to the caller-supplied `outputDir`.
