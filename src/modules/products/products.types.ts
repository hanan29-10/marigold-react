export type ProductCategory =
  | 'Totes'
  | 'Shoulder Bags'
  | 'Clutches'
  | 'Travel'
  | 'Crossbody'
  | 'Accessories';
export type ProductBadge =
  'Signature' | 'New season' | 'Limited' | 'Bestseller' | 'Gift edition';
export const productCategories: readonly ProductCategory[] = [
  'Totes',
  'Shoulder Bags',
  'Clutches',
  'Travel',
  'Crossbody',
  'Accessories',
];
export const productBadges: readonly ProductBadge[] = [
  'Signature',
  'New season',
  'Limited',
  'Bestseller',
  'Gift edition',
];
const categorySet: ReadonlySet<string> = new Set(productCategories);
const badgeSet: ReadonlySet<string> = new Set(productBadges);
export const isProductCategory = (value: string): value is ProductCategory =>
  categorySet.has(value);
export const isProductBadge = (value: string): value is ProductBadge =>
  badgeSet.has(value);
export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  badge: ProductBadge;
  image: string;
  secondaryImage?: string;
  description: string;
}
export type CatalogSort = 'featured' | 'price-low' | 'price-high' | 'name';
export interface CatalogState {
  category: ProductCategory | 'All';
  term: string;
  sort: CatalogSort;
}
