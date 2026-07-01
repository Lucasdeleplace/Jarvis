# Jarvis

Assistant IA personnel **local-first**, construit en monorepo.
Cette base ne contient **aucune fonctionnalite metier** : uniquement l'ossature technique.

## Stack

- **Monorepo** : pnpm workspaces + Turborepo
- **Langage** : TypeScript (mode `strict`)
- **Desktop** : Electron + electron-vite
- **UI** : React + Tailwind CSS
- **Persistance** : Prisma + SQLite
- **Qualite** : ESLint, Prettier, Husky, lint-staged, commitlint

## Structure

```
apps/
  desktop/         # Application Electron (main / preload / renderer React)
packages/
  contracts/       # Interfaces et types partages (aucune implementation)
  shared/          # Utilitaires purs
  core/            # Domaine metier (agnostique de l'infrastructure)
  persistence/     # Prisma + SQLite
```

## Demarrage

```bash
# 1. Installer les dependances
pnpm install

# 2. Copier la configuration d'environnement
cp .env.example .env

# 3. Preparer la base de donnees
pnpm db:migrate

# 4. Lancer l'application de bureau
pnpm dev:desktop
```

## Scripts principaux

| Commande            | Description                                  |
| ------------------- | -------------------------------------------- |
| `pnpm build`        | Build de tous les packages (Turbo)           |
| `pnpm typecheck`    | Verification TypeScript sur tout le monorepo |
| `pnpm lint`         | ESLint sur tout le monorepo                  |
| `pnpm format`       | Formatage Prettier                           |
| `pnpm dev:desktop`  | Lance Electron en developpement              |
| `pnpm db:generate`  | Genere le client Prisma                      |
| `pnpm db:migrate`   | Applique les migrations SQLite               |

## Conventions

- **Commits** : Conventional Commits (`feat(core): ...`), valides par commitlint.
- **Branches** : `feat/…`, `fix/…`, `chore/…`, `docs/…`.
- **Imports inter-packages** : toujours via l'alias `@jarvis/*`.
