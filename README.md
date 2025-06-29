# UEC 3D Map

電気通信大学のキャンパスを3Dで探索できるWebアプリ

## 動作環境

- Node.js 22 以上
- Chrome 最新版（動作確認済み）

## セットアップ

```bash
pnpm install
pnpm dev
```

http://localhost:3000で起動

## 操作方法

- WASD: 移動
- Space: ジャンプ
- マウス: 視点
- ESC: 一時停止

## 技術スタック

- Next.js 15.3.4
- React Three Fiber
- TypeScript
- Tailwind CSS v4

## ビルド

```bash
pnpm build
```

## デプロイ

Vercelにプッシュすると自動デプロイ

## ライセンス

MIT
