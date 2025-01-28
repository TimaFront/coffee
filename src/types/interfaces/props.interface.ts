import { ParsedProduct } from './product.interface';

export interface ProductListProps {
  products: ParsedProduct[];
  searchQuery: string;
}

export interface HeaderProps {
  onSearch: (term: string) => void;
} 