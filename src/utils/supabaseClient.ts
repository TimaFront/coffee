import { createClient } from '@supabase/supabase-js';
import { Product, Dessert, ParsedProduct } from '../types/interfaces/product.interface';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Отсутствуют необходимые переменные окружения для Supabase');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getAllProducts = async (): Promise<ParsedProduct[]> => {
  // Получаем кофе с сортировкой по id
  const { data: coffeeProducts, error: coffeeError } = await supabase
    .from('products')
    .select('*')
    .order('id');

  if (coffeeError) {
    console.error('Error fetching coffee products:', coffeeError);
    return [];
  }

  // Получаем десерты с сортировкой по id
  const { data: dessertProducts, error: dessertError } = await supabase
    .from('desserts')
    .select('*')
    .order('id');

  if (dessertError) {
    console.error('Error fetching desserts:', dessertError);
    return [];
  }

  // Преобразуем кофе в ParsedProduct
  const parsedCoffee: ParsedProduct[] = (coffeeProducts as Product[]).map(product => ({
    ...product,
    type: 'coffee' as const
  }));

  // Преобразуем десерты в ParsedProduct
  const parsedDesserts: ParsedProduct[] = (dessertProducts as Dessert[]).map(dessert => ({
    ...dessert,
    type: 'dessert' as const,
    volumes: undefined
  }));

  // Объединяем и возвращаем все продукты
  return [...parsedCoffee, ...parsedDesserts];
};