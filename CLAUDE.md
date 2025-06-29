# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

UEC 3D Map の更新版 - Next.js 15.3.4（App Router）+ React 19 + TypeScript + Tailwind CSS v4 を使用した 3D マップアプリケーション

## 開発コマンド

### 基本コマンド

- `pnpm dev` - 開発サーバー起動（localhost:3000）
- `pnpm build` - 本番ビルド
- `pnpm start` - 本番サーバー起動
- `pnpm lint` - ESLint によるコード検証

### リンター実行時の注意

- 必ず `pnpm lint` を実行してエラーがないことを確認
- 自動修正が可能な場合は `pnpm lint --fix` を使用

## プロジェクト構成

### フレームワーク・ライブラリ

- **Next.js 15.3.4**: App Router 使用、最新の React Server Components 対応
- **React 19**: 最新バージョンの React
- **TypeScript**: 厳格な型チェック設定
- **Tailwind CSS v4**: ユーティリティファースト CSS（最新バージョン）
- **ESLint**: next/core-web-vitals + next/typescript 設定

### ディレクトリ構造

```
src/
├── app/                # App Router（Next.js 13+）
│   ├── layout.tsx      # ルートレイアウト
│   ├── page.tsx        # ホームページ
│   └── globals.css     # グローバルスタイル
public/                 # 静的アセット
```

### 重要な設定ファイル

- `tsconfig.json`: TypeScript 設定（@/\* path mapping 有効）
- `eslint.config.mjs`: ESLint 設定（flat config 形式）
- `next.config.ts`: Next.js 設定
- `postcss.config.mjs`: PostCSS 設定（Tailwind 用）

## 開発ガイドライン

### コード規約

- TypeScript の厳格な型チェックに従う
- ESLint ルールを遵守（next/core-web-vitals + next/typescript）
- App Router パターンを使用（pages/ディレクトリは使用しない）
- Tailwind CSS のユーティリティクラスを優先
- フォント: Geist Sans + Geist Mono を使用

### ファイル作成時の注意

- 新しいページは `src/app/` 以下に作成
- コンポーネントは適切な型定義を含める
- Server Components と Client Components を適切に使い分ける

### 3D マップ関連の実装予定

- プロジェクト名から 3D マップ機能の実装が予想される
- Three.js、React Three Fiber 等の 3D ライブラリ追加が見込まれる
- WebGL 対応ブラウザでの動作が前提となる可能性
