import {Await, useLoaderData, Link} from 'react-router';
import type {Route} from './+types/_index';
import {Suspense} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import type {
  FeaturedCollectionFragment,
  RecommendedProductsQuery,
} from 'storefrontapi.generated';
import {ProductItem} from '~/components/ProductItem';

export const meta: Route.MetaFunction = () => {
  return [{title: 'VeganLife — Natural Beauty, Sustainable Living'}];
};

export async function loader(args: Route.LoaderArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context}: Route.LoaderArgs) {
  const [{collections}] = await Promise.all([
    context.storefront.query(FEATURED_COLLECTION_QUERY),
  ]);

  return {
    featuredCollection: collections.nodes[0],
  };
}

function loadDeferredData({context}: Route.LoaderArgs) {
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch((error: Error) => {
      console.error(error);
      return null;
    });

  return {
    recommendedProducts,
  };
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();
  return (
    <div>
      {/* ── Hero ─────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-green-50 to-stone-100 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-medium text-stone-900 mb-6 leading-tight">
              Natural Beauty, Sustainable Living
            </h1>
            <p className="text-lg sm:text-xl text-stone-600 mb-8 leading-relaxed">
              Discover premium vegan products crafted with care for you and the
              planet. 100% organic, cruelty-free, and shipped worldwide.
            </p>
            <Link
              to="/collections"
              className="inline-block bg-green-700 text-white px-8 py-3 rounded-full hover:bg-green-800 transition-colors font-medium text-sm"
            >
              Shop Collection
            </Link>
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="bg-green-50 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <span
                    className="text-green-700"
                    dangerouslySetInnerHTML={{__html: feature.icon}}
                  />
                </div>
                <h3 className="text-stone-900 font-medium text-sm sm:text-base mb-1 sm:mb-2">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Collection ──────────────────────── */}
      <FeaturedCollection collection={data.featuredCollection} />

      {/* ── Recommended Products ─────────────────────── */}
      <RecommendedProducts products={data.recommendedProducts} />

      {/* ── Newsletter ───────────────────────────────── */}
      <section className="py-16 bg-green-700 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-medium mb-4">
            Join Our Community
          </h2>
          <p className="text-green-100 mb-8">
            Get exclusive offers, sustainability tips, and be the first to know
            about new products
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-5 py-3 rounded-full text-stone-900 text-sm outline-none"
            />
            <button className="bg-white text-green-700 px-8 py-3 rounded-full hover:bg-stone-100 transition-colors font-medium text-sm">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ─── Featured Collection ─────────────────────────────── */
function FeaturedCollection({
  collection,
}: {
  collection: FeaturedCollectionFragment;
}) {
  if (!collection) return null;
  const image = collection?.image;
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-medium text-stone-900 mb-3">
            Featured Collection
          </h2>
          <p className="text-stone-500">
            Explore our curated selection
          </p>
        </div>
        <Link
          className="block relative rounded-2xl overflow-hidden group"
          to={`/collections/${collection.handle}`}
        >
          {image && (
            <div className="aspect-[16/9] sm:aspect-[21/9]">
              <Image
                data={image}
                sizes="100vw"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end">
            <div className="p-6 sm:p-10">
              <h3 className="text-white text-xl sm:text-3xl font-medium mb-2">
                {collection.title}
              </h3>
              <span className="inline-block text-white/80 text-sm border border-white/40 px-4 py-1.5 rounded-full hover:bg-white/10 transition-colors">
                Shop Now →
              </span>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}

/* ─── Recommended Products ────────────────────────────── */
function RecommendedProducts({
  products,
}: {
  products: Promise<RecommendedProductsQuery | null>;
}) {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-medium text-stone-900 mb-3">
            Recommended Products
          </h2>
          <p className="text-stone-500">
            Our most popular items loved by customers worldwide
          </p>
        </div>
        <Suspense fallback={<ProductGridSkeleton />}>
          <Await resolve={products}>
            {(response) => (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {response
                  ? response.products.nodes.map((product) => (
                      <ProductItem key={product.id} product={product} />
                    ))
                  : null}
              </div>
            )}
          </Await>
        </Suspense>
      </div>
    </section>
  );
}

/* ─── Skeleton ────────────────────────────────────────── */
function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-square bg-stone-200 rounded-xl mb-3" />
          <div className="h-4 bg-stone-200 rounded w-2/3 mb-2" />
          <div className="h-4 bg-stone-200 rounded w-1/3" />
        </div>
      ))}
    </div>
  );
}

/* ─── Features data ───────────────────────────────────── */
const FEATURES = [
  {
    icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>',
    title: '100% Vegan',
    description: 'All products are certified vegan and cruelty-free',
  },
  {
    icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>',
    title: 'Organic Certified',
    description: 'Premium organic ingredients from sustainable sources',
  },
  {
    icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>',
    title: 'Ethically Made',
    description: 'Fair trade practices and ethical manufacturing',
  },
  {
    icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>',
    title: 'Worldwide Shipping',
    description: 'Fast and eco-friendly shipping to over 50 countries',
  },
];

/* ─── GraphQL Queries ─────────────────────────────────── */
const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
` as const;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    featuredImage {
      id
      url
      altText
      width
      height
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 4, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
` as const;
