export interface PriceOption {
  size: number;
  price: number;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  imageurl: string;
  volumes: PriceOption[];
}

export interface Dessert {
  id: number;
  name: string;
  description: string;
  imageurl: string;
  price: number;
}

export interface ParsedProduct {
  id: number;
  name: string;
  description: string;
  imageurl: string;
  type: 'coffee' | 'dessert';
  volumes?: PriceOption[];
  price?: number;
} 