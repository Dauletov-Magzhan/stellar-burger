import { orderBurgerApi } from "@api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { TConstructorItems, TIngredient, TOrder } from "@utils-types";

interface OrderInitialState {
    ingredients: TIngredient[]
    orderModalData: TOrder | null,
    orders: TOrder[],
    orderRequest: boolean
    constructorItems: TConstructorItems
}

const initialState: OrderInitialState = {
    ingredients: [],
    orderModalData: null,
    orders: [],
    orderRequest: false,
    constructorItems: {
        bun: {
            price: 0,
        },
        ingredients: []
      },
}

export const fetchOrderBurger = createAsyncThunk(
    'order/orderBurger',
    async (data: string[], thunkApi) => {
        try{
            const res = orderBurgerApi(data)
            return res
        } catch (err) {
            return thunkApi.rejectWithValue(err)
        }
    }
)

export const ordersSlices = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        closeOrderModalData(state) {
            state.orderModalData = null;
            state.constructorItems = {
                bun: {
                  price: 0
                },
                ingredients: []
              };
        }
    },
    selectors: {
        selectOrderModalData: (state) => {
            return state.orderModalData
        },
        selectOrderRequest: (state) => {
            return state.orderRequest
        }
    },
    extraReducers: (builder) => {
        builder 
            .addCase(fetchOrderBurger.fulfilled, (state, action) => {
                state.orderModalData = action.payload.order
                state.orderRequest = false
            })
            .addCase(fetchOrderBurger.pending, (state) => {
                state.orderRequest = true
            })
            .addCase(fetchOrderBurger.rejected, (state) => {
                state.orderRequest = false
            })
    }
})

export const { selectOrderModalData, selectOrderRequest } = ordersSlices.selectors
export const { closeOrderModalData } = ordersSlices.actions
export default ordersSlices.reducer
