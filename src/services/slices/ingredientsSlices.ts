import { getIngredientsApi } from '../../utils/burger-api';
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  TIngredient,
  TConstructorIngredient,
  TConstructorItems
} from '@utils-types';
import { v4 as uuid4 } from 'uuid';

interface IngredientsInitialState {
  ingredients: TIngredient[];
  constructorItems: TConstructorItems;
  isModalOpened: boolean;
  isLoading: boolean;
  isModal: boolean;
}

const initialState: IngredientsInitialState = {
  ingredients: [],
  constructorItems: {
    bun: {
      price: 0,
      _id: ''
    },
    ingredients: []
  },
  isModalOpened: false,
  isLoading: false,
  isModal: false
};

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchIngredients',
  async () => getIngredientsApi()
);

const ingredientsSlices = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.constructorItems.bun = action.payload;
        } else {
          state.constructorItems.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: uuid4() }
      })
    },
    removeIngredient(state, action: PayloadAction<TConstructorIngredient>) {
      const ingredientId = state.constructorItems.ingredients.findIndex(
        (item) => item.id === action.payload.id
      );

      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (_, ingredient) => ingredient !== ingredientId
        );
    },
    moveUpIngredient(state, action: PayloadAction<TConstructorIngredient>) {
      const ingredientIndex = state.constructorItems.ingredients.findIndex(
        (item) => item.id === action.payload.id
      );
      const prevItem = state.constructorItems.ingredients[ingredientIndex - 1];
      state.constructorItems.ingredients.splice(
        ingredientIndex - 1,
        2,
        action.payload,
        prevItem
      );
    },
    moveDownIngredient(state, action: PayloadAction<TConstructorIngredient>) {
      const ingredientIndex = state.constructorItems.ingredients.findIndex(
        (item) => item.id === action.payload.id
      );
      const nextItem = state.constructorItems.ingredients[ingredientIndex + 1];
      state.constructorItems.ingredients.splice(
        ingredientIndex,
        2,
        nextItem,
        action.payload
      );
    }
  },
  selectors: {
    selectIngredients: (state) => state.ingredients,
    selectConstructorItems: (state) => state.constructorItems,
    selectIsModalOpened: (state) => state.isModalOpened
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.ingredients = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchIngredients.rejected, (state) => {
        state.isLoading = false;
      });
  }
});

export const {
  selectIngredients,
  selectConstructorItems,
  selectIsModalOpened
} = ingredientsSlices.selectors;
export const {
  addIngredient,
  removeIngredient,
  moveDownIngredient,
  moveUpIngredient
} = ingredientsSlices.actions;
export default ingredientsSlices.reducer;
