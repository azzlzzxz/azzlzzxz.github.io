# 包管理器工具

## ni

:::tip

**[ni](https://github.com/antfu/ni#ni)** 根据你的项目使用对应的包管理工具。

支持：`npm` · `yarn` · `pnpm` · `bun`
:::

### 全局安装

```sh
npm i -g @antfu/ni
```

### `ni` 命令

```sh
ni

# npm install
# yarn install
# pnpm install
# bun install
```

```sh
ni vite

# npm i vite
# yarn add vite
# pnpm add vite
# bun add vite
```

```sh
ni --frozen

# npm ci
# yarn install --frozen-lockfile (Yarn 1)
# yarn install --immutable (Yarn Berry)
# pnpm install --frozen-lockfile
# bun install --no-save
```

### `nr` - `run`

```sh
nr dev --port=3000

# npm run dev -- --port=3000
# yarn run dev --port=3000
# pnpm run dev --port=3000
# bun run dev --port=3000
```

### `nlx` - `download` & `execute`

```sh
nlx vitest

# npx vitest
# yarn dlx vitest
# pnpm dlx vitest
# bunx vitest
```

### `nu` - `upgrade`

```sh
nu

# npm upgrade
# yarn upgrade (Yarn 1)
# yarn up (Yarn Berry)
# pnpm update
# bun update
```

```sh
nu -i

# (not available for npm & bun)
# yarn upgrade-interactive (Yarn 1)
# yarn up -i (Yarn Berry)
# pnpm update -i
```

### `nun` - `uninstall`

```sh
nun webpack

# npm uninstall webpack
# yarn remove webpack
# pnpm remove webpack
# bun remove webpack
```
