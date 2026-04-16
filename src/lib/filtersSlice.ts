import { createSlice, PayloadAction } from '@reduxjs/toolkit';

  interface FilterState {
    selectedCategory: 'all' | 'Summer' | 'Winter' | 'Spring' | 'Fall' | 'Collection';
    sortBy: 'featured' | 'price' | 'price-desc' | 'name';
  }

  const initialState: FilterState = {
    selectedCategory: 'all',
    sortBy: 'featured'
  };

  const filtersSlice = createSlice({
    name: 'filters',
    initialState,
    reducers: {
      setCategory: (state, action: PayloadAction<string>) => {
        state.selectedCategory = action.payload as FilterState['selectedCategory'];
      },
      setSortBy: (state, action: PayloadAction<string>) => {
        state.sortBy = action.payload as FilterState['sortBy'];
      }
    }
  });

  export const { setCategory, setSortBy } = filtersSlice.actions;
  export default filtersSlice.reducer;