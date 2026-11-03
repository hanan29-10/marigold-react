export type ProductCategory =
  | 'Totes'
  | 'Shoulder Bags'
  | 'Clutches'
  | 'Travel'
  | 'Crossbody'
  | 'Accessories';
export type ProductBadge =
  'Signature' | 'New season' | 'Limited' | 'Bestseller' | 'Gift edition';
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
