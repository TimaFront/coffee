import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ParsedProduct } from '../../types';

interface CartItem {
  product: ParsedProduct;
  quantity: number;
  selectedSize?: number;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: JSON.parse(localStorage.getItem('cart') || '[]'),
};

interface AddToCartPayload {
  product: ParsedProduct;
  selectedSize?: number;
  quantity?: number;
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<AddToCartPayload>) => {
      const { product, selectedSize, quantity = 1 } = action.payload;
      const existingItem = state.items.find(
        item => item.product.id === product.id && item.selectedSize === selectedSize
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({ product, quantity, selectedSize });
      }
      
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    removeFromCart: (state, action: PayloadAction<{ productId: number; selectedSize?: number }>) => {
      const { productId, selectedSize } = action.payload;
      state.items = state.items.filter(
        item => !(item.product.id === productId && item.selectedSize === selectedSize)
      );
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    updateQuantity: (state, action: PayloadAction<{ 
      productId: number; 
      selectedSize?: number;
      quantity: number 
    }>) => {
      const { productId, selectedSize, quantity } = action.payload;
      const item = state.items.find(
        item => item.product.id === productId && item.selectedSize === selectedSize
      );
      if (item) {
        item.quantity = Math.max(0, quantity);
        if (item.quantity === 0) {
          state.items = state.items.filter(i => i !== item);
        }
      }
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer; 