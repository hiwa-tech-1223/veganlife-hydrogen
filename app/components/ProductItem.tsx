import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import type {
  ProductItemFragment,
  CollectionItemFragment,
  RecommendedProductFragment,
} from 'storefrontapi.generated';
import {useVariantUrl} from '~/lib/variants';

export function ProductItem({
  product,
  loading,
}: {
  product:
    | CollectionItemFragment
    | ProductItemFragment
    | RecommendedProductFragment;
  loading?: 'eager' | 'lazy';
}) {
  const variantUrl = useVariantUrl(product.handle);
  const image = product.featuredImage;

  return (
    <Link
      className="product-item group"
      key={product.id}
      prefetch="intent"
      to={variantUrl}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden">
        {image && (
          <Image
            alt={image.altText || product.title}
            aspectRatio="1/1"
            data={image}
            loading={loading}
            sizes="(min-width: 45em) 400px, 50vw"
            className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
          />
        )}
        {/* Vegan Badge */}
        <span
          className="absolute top-2.5 right-2.5 text-xs font-medium px-2 py-1 rounded-full"
          style={{
            background: 'rgba(240, 253, 244, 0.92)',
            backdropFilter: 'blur(8px)',
            color: '#15803d',
          }}
        >
          🌱 Vegan
        </span>
      </div>

      {/* Info */}
      <div className="p-3 sm:p-4">
        <h4 className="text-sm sm:text-base font-medium text-stone-900 mb-1 leading-snug line-clamp-1">
          {product.title}
        </h4>
        <div className="text-sm font-semibold text-stone-900">
          <Money data={product.priceRange.minVariantPrice} />
        </div>
      </div>
    </Link>
  );
}
