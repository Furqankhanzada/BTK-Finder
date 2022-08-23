import {
  CatalogItemConnection,
  CatalogItemProduct,
  CatalogProduct,
  Maybe,
} from '../../../models/graphql';

export const buildProducts = (
  catalogItems: Maybe<CatalogItemConnection>,
): CatalogProduct[] => {
  let alterProducts: CatalogProduct[] = [];
  catalogItems?.edges?.forEach((catalogItem) => {
    const catalogItemNode = catalogItem?.node as CatalogItemProduct;
    const product = catalogItemNode.product as CatalogProduct;

    if (product) {
      alterProducts.push(product);
    }
  });
  return alterProducts;
};
