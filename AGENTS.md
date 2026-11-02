<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Commands

- `npm run dev` — dev server (Turbopack, port 3000). `npm run build`, `npm start` for production.
- `npm run lint` — bare `eslint` (flat config, lints the whole tree).
- No typecheck script: run `npx tsc --noEmit` yourself after type changes that build/lint won't catch.
- No test runner exists; don't invent one — verify via lint + typecheck + `npm run build`.

## Config quirks

- Next 16 with `cacheComponents: true`, `partialPrefetching: true`, `reactCompiler: true` in `next.config.ts`. React Compiler is active: don't hand-wrap components in `memo`/`useCallback`/`useMemo` defensively.
- `cacheComponents` changes async-data rules (cacheless fetches, `use cache`, `<Suspense>` requirements) — consult `node_modules/next/dist/docs/` instead of relying on older Next.js habits.
- Tailwind CSS v4 is CSS-first: all theme tokens/config live in `src/app/globals.css` via `@theme`; there is no `tailwind.config.*`. Tailwind is wired through Turbopack (`@tailwindcss/turbopack` rule in `next.config.ts`), so styles only load via `next` processes.
- Tailwind v4 syntax is used in component class strings, e.g. `text-(--shiki-light)` referencing CSS variables — not Tailwind v2/v3 arbitrary-value style.
- Path alias `@/*` → `src/*` (`tsconfig.json` paths).

## UI components

- shadcn-style components live in `src/components/ui` and are generated (`npx shadcn add <component>`, `components.json`); style is `base-nova`.
- These primitives are built on `@base-ui/react`, **not** Radix UI — import APIs from `@base-ui/react` (`mergeProps`, `useRender`, ...), not `@radix-ui/*`.
- Generated components import `cn` from the `cn` package directly, not `@/lib/utils`; follow that pattern when editing them.
- There is no `asChild` — Base UI composes elements via the `render` prop: `<Button render={<Link href="/login" />} nativeButton={false}>Login</Button>`, `<DropdownMenuItem render={<Link href="..." />}>`. With `Button`, a non-button render target (e.g. `<Link>`) must also set `nativeButton={false}` or the dev log warns about missing native button semantics.
- Components follow the `data-slot="..."` convention (styling targets slots via `[data-slot=...]` selectors); keep it when creating new ones.

## Lib notes

- `src/lib/highlighter.tsx` is a streaming Shiki highlighter: it returns per-line React nodes plus a `GrammarState` to resume tokenization; languages must be added to its `languages` map to work.
- `src/hooks/use-highlighted-code.ts` builds on that for streaming chat-code rendering — respect its incremental (streamed-line) contract; `grammarState` is what keeps streamed lines highlighted consistently.

## Repo shape

- Single package, App Router only (`src/app`); `src/app/page.tsx` is currently an empty placeholder. README.md is create-next-app boilerplate — trust config/scripts, not the README.
