# 🌿 VeganLife — Vegan Cross-Border E-Commerce

ヴィーガン商品に特化した越境 EC サイト。  
Shopify Hydrogen（ヘッドレスコマース）で構築し、Storefront API（GraphQL）経由でリアルタイムに商品・カート・決済データを取得。  
将来的に FastAPI + ML によるパーソナライズレコメンド機能を統合予定。

> **Demo Store:** [hcnmdc-dc.myshopify.com](https://hcnmdc-dc.myshopify.com)

---

## テクノロジースタック

**Frontend**

- [Shopify Hydrogen](https://hydrogen.shopify.dev/) v2026.1 — Shopify 公式の React ベースヘッドレスフレームワーク
- [React Router](https://reactrouter.com/) v7 — SSR + ストリーミング対応フルスタック Web フレームワーク
- React 18 / TypeScript 5
- Tailwind CSS 4

**Backend（Shopify）**

- Storefront API（GraphQL）— 商品・コレクション・カート・チェックアウト
- Shopify Markets — 多通貨・多言語対応可能な設計

**Backend（カスタム / 計画中）**

- FastAPI（Python）— レビュー・AI レコメンド・全文検索
- scikit-learn — コサイン類似度ベースのレコメンドエンジン
- LangChain + LLM — AI チャットボット（RAG）
- PostgreSQL (RDS) / ElastiCache Redis

**インフラ**

- Oxygen（Shopify）— Hydrogen 専用ホスティング
- AWS ECS Fargate — カスタムバックエンド（計画中）

---

## アーキテクチャ

```
┌───────────────────────────────────────────────┐
│           Hydrogen (React Router v7)           │
│          TypeScript + Tailwind CSS             │
│            Deploy → Oxygen                     │
└────────┬────────────────────┬─────────────────┘
         │ GraphQL             │ REST/GraphQL
         ▼                    ▼
┌────────────────┐   ┌──────────────────────────┐
│ Shopify         │   │ FastAPI (AWS)  [計画中]   │
│ Storefront API  │   │                          │
│ ────────────── │   │ • AI レコメンド            │
│ • Products      │   │   (scikit-learn)         │
│ • Cart          │   │ • チャットボット           │
│ • Checkout      │   │   (LangChain + LLM)     │
│ • Collections   │   │ • レビューシステム         │
│ • Multi-currency│   │                          │
└────────────────┘   └──────────────────────────┘
```

---

## データフロー

```
.env (APIトークン)
  │
  ▼
server.ts
  │  createStorefrontClient() → Shopify との接続を作成
  │  createCartHandler() → カート管理を作成
  │  handleRequest(request, { storefront, cart, env })
  │                              │
  │            context として loader に渡される
  │                              │
  ▼                              ▼
routes/($locale)._index.tsx
  │  loader:
  │    loadCriticalData() → await（即座に必要なデータ）
  │    loadDeferredData() → 非同期（後から流し込むデータ）
  │
  │  context.storefront.query(GraphQL)
  │         │
  │         ▼
  │    Shopify Storefront API に GraphQL リクエスト
  │         │
  │         ▼
  │    JSON レスポンス（商品・コレクション等）
  │
  ▼
コンポーネント:
  useLoaderData() で loader の結果を受け取り
  <ProductItem>, <Image>, <Money> で画面に描画
  │
  ▼
ブラウザに HTML を返す
```

---

## プロジェクト構成

```
hydrogen-storefront/
├── app/
│   ├── root.tsx                              # HTML 骨格 + 全ページ共通レイアウト
│   ├── entry.client.tsx                      # ブラウザ側の React 起動処理
│   ├── entry.server.tsx                      # サーバー側の SSR 初期化
│   ├── components/
│   │   ├── Layout.tsx                        # Header + Footer
│   │   ├── ProductItem.tsx                   # 商品カード (<Image>, <Money>)
│   │   └── ...                               # その他 scaffold 生成コンポーネント
│   ├── lib/
│   │   └── ...                               # GraphQL フラグメント、ユーティリティ
│   ├── routes/
│   │   ├── ($locale)._index.tsx              # トップページ (Hero + Featured + Recommended)
│   │   ├── ($locale).products.$handle.tsx    # 商品詳細 (VariantSelector, defer)
│   │   ├── ($locale).collections.$handle.tsx # コレクション (Pagination)
│   │   ├── ($locale).cart.tsx                # カートページ (CartForm actions)
│   │   ├── ($locale).search.tsx              # 検索ページ
│   │   ├── ($locale).account.tsx             # アカウントページ
│   │   └── ...                               # その他 scaffold 生成ページ
│   └── styles/
│       └── tailwind.css                      # Tailwind エントリー
├── server.ts                                 # 全リクエストの入口（storefront, cart 作成）
├── vite.config.ts                            # Vite + Hydrogen/Oxygen プラグイン
├── tailwind.config.ts                        # Tailwind 設定
├── env.d.ts                                  # 環境変数・context の型定義
├── tsconfig.json
├── package.json
├── storefrontapi.generated.d.ts              # GraphQL 型定義（codegen で自動生成）
└── .env                                      # Shopify API 認証情報 (gitignore)
```

**ルーティング規則:** ファイル名がそのまま URL になる。`$handle` は動的パラメータ、`($locale)` は多言語対応用の省略可能なプレフィックス。

| ファイル名 | URL 例 |
|---|---|
| `($locale)._index.tsx` | `/` or `/ja` |
| `($locale).products.$handle.tsx` | `/products/vegan-cheesecake` |
| `($locale).collections.$handle.tsx` | `/collections/snacks` |
| `($locale).cart.tsx` | `/cart` |

---

## Hydrogen 固有の機能

| 機能 | 使用箇所 | 説明 |
|------|----------|------|
| `createStorefrontClient()` | server.ts | Shopify API クライアント作成（認証・キャッシュ内蔵） |
| `context.storefront.query()` | 全 route loader | Storefront API へ GraphQL クエリ送信 |
| `<Image>` | ProductItem | Shopify CDN 画像最適化（srcSet, lazy loading） |
| `<Money>` | ProductItem, Cart | 多通貨フォーマット（Shopify Markets 対応） |
| `<CartForm>` | Cart | サーバーサイド Cart mutation（追加/更新/削除） |
| `<VariantSelector>` | ProductDetail | URL ベースのバリアント選択・同期 |
| `<Pagination>` | Collections | カーソルベースページネーション |
| `<Suspense>` + `<Await>` | トップページ | ストリーミング SSR（Critical/Deferred の2段構成） |
| `getSeoMeta()` | 全ページ | SEO メタタグ自動生成 |
| `<Analytics.Provider>` | root.tsx | Shopify Analytics 統合 |

---

## セットアップ

### 前提条件

- Node.js >= 18
- Shopify パートナーアカウント + 開発ストア
- npm or yarn

### 手順

```bash
# 1. リポジトリをクローン
git clone https://github.com/hiwa-tech-1223/veganlife-hydrogen.git
cd veganlife-hydrogen

# 2. 依存関係インストール
npm install

# 3. Shopify ストアと連携
npx shopify hydrogen link

# 4. 環境変数を自動取得
npx shopify hydrogen env pull

# 5. 開発サーバー起動
npm run dev
```

ブラウザで `http://localhost:3000` を開いて動作確認。

### 環境変数

`.env` に以下が設定されます（`env pull` で自動取得）：

```env
SESSION_SECRET="..."
PUBLIC_STOREFRONT_API_TOKEN="..."
PRIVATE_STOREFRONT_API_TOKEN="..."
PUBLIC_STORE_DOMAIN="your-store.myshopify.com"
PUBLIC_STOREFRONT_ID="..."
```

---

## デプロイ

```bash
# Oxygen (Shopify) にデプロイ
npx shopify hydrogen deploy
```

---

## npm scripts

| コマンド | 説明 |
|---------|------|
| `npm run dev` | 開発サーバー起動（コード生成付き） |
| `npm run build` | プロダクションビルド |
| `npm run preview` | ビルド後のプレビュー |
| `npm run codegen` | GraphQL 型定義の生成 |
| `npm run typecheck` | TypeScript 型チェック |

---

## ライセンス

MIT
