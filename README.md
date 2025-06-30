# UEC 3D Map

電気通信大学のキャンパスを3Dで探索できるWebアプリ  
FPS風の操作でリアルタイムマルチプレイヤー対応

## 動作環境

- Node.js 22 以上
- Chrome 最新版（動作確認済み）

## セットアップ

```bash
pnpm install
pnpm dlx supabase start  # ローカルSupabase起動
pnpm dev
```

http://localhost:3000で起動

## 機能

- **3D探索**: FPS風操作でキャンパス内を自由移動
- **リアルタイムマルチプレイヤー**: 最大10人まで同時接続
- **匿名参加**: アカウント不要で即座に参加可能
- **ライブ位置同期**: 他プレイヤーの移動をリアルタイム表示

## 操作方法

- WASD: 移動
- Space: ジャンプ
- マウス: 視点
- ESC: 一時停止

## 技術スタック

- Next.js 15.3.4
- React Three Fiber (@react-three/fiber, @react-three/drei)
- Supabase (リアルタイム同期・匿名認証)
- TypeScript
- Tailwind CSS v4

## 開発

```bash
pnpm lint      # コード検証
pnpm build     # 本番ビルド
```

## デプロイ

Vercelにプッシュすると自動デプロイ  
本番環境ではSupabaseプロジェクトの設定が必要

## ライセンス

MIT
