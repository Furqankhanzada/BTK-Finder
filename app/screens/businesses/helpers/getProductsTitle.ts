import { BusinessType } from '../models/BusinessPresentable';

export const getProductsTitle = (type?: string) => {
  switch (type) {
    case BusinessType.restaurant:
      return 'Menu';
    case BusinessType.gym:
      return 'Packages';
    default:
      return 'Products';
  }
};
