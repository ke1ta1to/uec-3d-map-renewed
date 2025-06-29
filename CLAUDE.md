# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

電気通信大学の3Dキャンパスマップ - FPS風の操作で探索可能な3D WebGLアプリケーション

## 開発コマンド

- `pnpm dev` - 開発サーバー起動（localhost:3000）
- `pnpm build` - 本番ビルド
- `pnpm lint` - ESLint検証（コード変更後は必ず実行）
- `pnpm lint --fix` - 自動修正可能なエラーを修正

## アーキテクチャ

### コア技術スタック

- **Next.js 15.3.4** (App Router)
- **React Three Fiber** (@react-three/fiber) - 3D描画
- **@react-three/drei** - R3F用ヘルパー（useGLTF、KeyboardControls等）
- **TypeScript** + **Tailwind CSS v4**

### 主要コンポーネント構成

```
src/components/
├── Scene/
│   ├── Scene.tsx        # メインシーン管理、ライティング、ローディング制御
│   ├── Model.tsx        # GLBモデル読み込み（API経由）
│   └── Player.tsx       # FPSコントローラー（移動、視点、物理演算）
├── UI/
│   ├── LoadingSpinner.tsx # プログレスバー付きローディング画面
│   ├── Instructions.tsx   # 操作説明・設定パネル
│   └── DebugInfo.tsx     # FPS、位置、回転情報表示
└── common/
    └── Card.tsx         # 再利用可能UIカードコンポーネント
```

### GLBモデル取得方式

`/api/model` ルートを経由して外部URL（https://www.uec.ac.jp/about/profile/access/map/uec-all.glb）から取得。CORSエラーを回避するためのプロキシ実装。

```typescript
// Model.tsx
const gltf = useGLTF("/api/model");
```

### FPSコントロール実装

- **移動**: WASD キー（KeyboardControls使用）
- **ジャンプ**: Space（重力値: 30）
- **視点**: マウス（PointerLock API）
- **一時停止**: ESC（再開は画面クリック、5回まで自動リトライ）

PointerLock解除後の再開時にエラーが発生する場合があるため、段階的な遅延（350ms～950ms）でリトライ処理を実装。

### ローディングシステム

1. LoadingSpinner表示（プログレスバー0%→85%）
2. モデル読み込み完了後、`completeLoading()`呼び出し
3. プログレス100%→フェードアウト（0.6秒）
4. メインUI表示

### UI設計パターン

- **Cardコンポーネント**: `dark`/`darker`バリアント、統一されたスタイル
- **z-index階層**:
  - LoadingSpinner: z-[60]
  - DebugInfo/Instructions: z-50
  - PointerLockオーバーレイ: z-40

### 開発時の注意事項

1. **Client Components**: 3D関連コンポーネントは全て`'use client'`必須
2. **SSR対応**: useGLTF等のhooksはuseEffect内で実行
3. **デバッグ情報**: 開始位置(100, 2, -100)、歩行速度11、ジャンプ高9がデフォルト
4. **ライティング**: 複数のdirectionalLight + ambientLight + hemisphereLight + pointLight

### パフォーマンス最適化

- API経由のGLBファイルは24時間キャッシュ
- React Three Fiberのoptimizeパッケージインポート設定
- Suspenseによる遅延読み込み
