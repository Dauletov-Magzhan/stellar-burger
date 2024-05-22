import { getIngredientsApi } from '@api'
import {PayloadAction, createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import { TIngredient, TConstructorIngredient, TConstructorItems } from '@utils-types'
import { v4 } from 'uuid'

interface IngredientsInitialState {
    ingredients: TIngredient[]
    constructorItems: TConstructorItems
    isModalOpened: boolean
    isLoading: boolean
}

const initialState: IngredientsInitialState = {
    ingredients: [],
    constructorItems: {
        bun: {
            price: 0
        },
        ingredients: []
      },
    isModalOpened: false,
    isLoading: false
}

export const fetchIngredients = createAsyncThunk(
    'ingredients/fetchIngredients',
    async (_, thunkAPI) => {
        try{
            const res = await getIngredientsApi()
            return res
        } catch (err){
            return thunkAPI.rejectWithValue(err)
        }
    }
)

const ingredientsSlices = createSlice({
    name: 'ingredients',
    initialState,
    reducers: {
        addIngredient(state, action: PayloadAction<TIngredient>){
            if(action.payload.type === 'bun'){
                state.constructorItems.bun = action.payload
            } else {
                state.constructorItems.ingredients.push({
                    ...action.payload,
                    id: v4()
                })
            }
        },
        removeIngredient(state, action: PayloadAction<TConstructorIngredient>){
            const ingredientId = state.constructorItems.ingredients.findIndex(item => item.id === action.payload.id)

            state.constructorItems.ingredients = state.constructorItems.ingredients.filter((_, ingredient) => ingredient !== ingredientId)
        },
        openModal(state){
            state.isModalOpened = true
        },
        closeModal(state){
            state.isModalOpened = false
        }
    },
    selectors: {
        selectIngredients: (state) => {
            return state.ingredients
        },
        selectConstructorItems: (state) => {
            return state.constructorItems
        },
        selectIsModalOpened: (state) => {
            return state.isModalOpened
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchIngredients.fulfilled, (state, action) => {
                state.ingredients = action.payload
                state.isLoading = false
            })
            .addCase(fetchIngredients.pending, (state) => {
                state.isLoading = true
            })
            .addCase(fetchIngredients.rejected, (state) => {
                state.isLoading = false
            })
        
    },
})


export const { selectIngredients, selectConstructorItems, selectIsModalOpened } = ingredientsSlices.selectors
export const { addIngredient, removeIngredient, openModal, closeModal } = ingredientsSlices.actions
export default ingredientsSlices.reducer;
