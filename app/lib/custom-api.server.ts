/*
 * ═══════════════════════════════════════════════════════════
 *  Custom API Client — FastAPI GraphQL (AWS)
 * ═══════════════════════════════════════════════════════════
 *  Shopify が管理しないカスタムデータを取得するクライアント。
 *  サーバーサイドのみで動作 (.server.ts)
 *
 *  AWS 構成:
 *    API Gateway → FastAPI (Fargate) → Aurora MySQL
 *    Lambda → Bedrock (AI レコメンド)
 *    OpenSearch (全文検索)
 *    ElastiCache (キャッシュ)
 *
 *  使い方 (loader 内):
 *    import {fetchCustomAPI, PRODUCT_REVIEWS_QUERY} from '~/lib/custom-api.server';
 *
 *    const reviews = await fetchCustomAPI({
 *      endpoint: context.env.CUSTOM_API_ENDPOINT,
 *      query: PRODUCT_REVIEWS_QUERY,
 *      variables: { productId: params.handle },
 *    });
 */

interface CustomAPIOptions {
  endpoint: string;
  query: string;
  variables?: Record<string, unknown>;
}

export async function fetchCustomAPI<T = unknown>({
  endpoint,
  query,
  variables = {},
}: CustomAPIOptions): Promise<T> {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({query, variables}),
  });

  if (!response.ok) {
    throw new Error(`Custom API error: ${response.status} ${response.statusText}`);
  }

  const json = (await response.json()) as {data: T; errors?: unknown[]};

  if (json.errors) {
    console.error('Custom API GraphQL errors:', json.errors);
    throw new Error('Custom API returned errors');
  }

  return json.data;
}

/** 商品レビュー取得 */
export const PRODUCT_REVIEWS_QUERY = `
  query ProductReviews($productId: String!, $first: Int = 10) {
    reviews(productId: $productId, first: $first) {
      edges {
        node { id author rating title body createdAt verified }
      }
      averageRating
      totalCount
    }
  }
`;

/** AI レコメンデーション (AWS Bedrock) */
export const AI_RECOMMENDATIONS_QUERY = `
  query AIRecommendations($productId: String!, $userId: String) {
    recommendations(productId: $productId, userId: $userId) {
      products { shopifyProductId score reason }
    }
  }
`;
