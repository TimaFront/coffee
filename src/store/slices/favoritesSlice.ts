import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ParsedProduct } from '../../types';

interface FavoritesState {
  items: ParsedProduct[];
}

const initialState: FavoritesState = {
  items: JSON.parse(localStorage.getItem('favorites') || '[]'),
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<ParsedProduct>) => {
      const existingIndex = state.items.findIndex(item => item.id === action.payload.id);
      
      if (existingIndex >= 0) {
        state.items.splice(existingIndex, 1);
      } else {
        // Проверяем, нет ли уже такого товара с другим типом
        const hasSameId = state.items.some(item => 
          item.id === action.payload.id && item.type !== action.payload.type
        );
        
        // Если нет товара с таким же ID или он другого типа, добавляем
        if (!hasSameId) {
          state.items.push(action.payload);
        }
      }
      
      localStorage.setItem('favorites', JSON.stringify(state.items));
    },
  },
});

export const { toggleFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer; 