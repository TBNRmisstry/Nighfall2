# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Discord Bot

The Discord bot runs inside the `api-server` artifact alongside the Express server.

- **Bot name**: Nightfall#5499
- **Client ID**: `1490005532562686183`
- **Token**: stored in `DISCORD_TOKEN` secret
- **Client ID env var**: `DISCORD_CLIENT_ID`

### Slash Commands
| Command | Description |
|---|---|
| `/ping` | Shows bot latency |
| `/help` | Lists all commands |
| `/serverinfo` | Shows server info |

### Bot source files
- `artifacts/api-server/src/bot/index.ts` — bot client & event handler
- `artifacts/api-server/src/bot/deploy-commands.ts` — registers slash commands on startup
- `artifacts/api-server/src/bot/commands/` — individual command files

### Adding a new command
1. Create `artifacts/api-server/src/bot/commands/<name>.ts` with `data` and `execute` exports
2. Import it in both `src/bot/index.ts` and `src/bot/deploy-commands.ts`
3. Restart the workflow — commands auto-deploy on startup

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
