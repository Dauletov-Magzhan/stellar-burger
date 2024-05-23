import { getFeedsApi, getOrdersApi, orderBurgerApi } from "@api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { TConstructorItems, TIngredient, TOrder } from "@utils-types";
import { produce } from 'immer'

interface OrderInitialState {
    ingredients: TIngredient[]
    orderModalData: TOrder | null
    orders: TOrder[]
    ordersTotal: number
    ordersToday: number
    orderRequest: boolean
    userOrders: TOrder[]
    constructorItems: TConstructorItems
    error: string
}

const initialState: OrderInitialState = {
    ingredients: [],
    orderModalData: null,
    orders: [],
    ordersTotal: 0,
    ordersToday: 0,
    orderRequest: false,
    constructorItems: {
        bun: {
            price: 0,
        },
        ingredients: []
      },
    userOrders: [],
    error: ''
}

export const fetchOrderBurger = createAsyncThunk(
    'order/orderBurger',
    async (data: string[], thunkApi) => {
        try{
            const res = await orderBurgerApi(data)
            return res
        } catch (err) {
            return thunkApi.rejectWithValue(err)
        }
    }
)

export const fetchFeeds = createAsyncThunk(
    'order/feeds',
    async (_, thunkApi) => {
        try{
            const res = await getFeedsApi()
            return res
        } catch (err) {
            return thunkApi.rejectWithValue(err)
        }
    }
)

export const fetchOrders = createAsyncThunk(
    'order/orders',
    async (_, thunkApi) => {
        try{
            const res = await getOrdersApi()
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
            state.orderRequest = false;
            state.orderModalData = null;
            state.constructorItems = {
                bun: {
                    price: 0
                },
                ingredients: []
            }
        },
    },
    selectors: {
        selectOrderModalData: (state) => {
            return state.orderModalData
        },
        selectOrderRequest: (state) => {
            return state.orderRequest
        },
        selectOrders: (state) => {
            return state.orders
        },
        selectOredersTotal: (state) => {
            return state.ordersTotal
        },
        selectOrdersToday: (state) => {
            return state.ordersToday
        },
        selectUserOrders: (state) => {
            return state.userOrders
        }
    },
    extraReducers: (builder) => {
        builder 
            .addCase(fetchOrderBurger.fulfilled, (state, action) => {
                state.orderModalData = action.payload.order
                state.constructorItems = {
                    bun: {
                        price: 0,
                    },
                    ingredients: []
                  },
                state.orderRequest = false
            })
            .addCase(fetchOrderBurger.pending, (state) => {
                state.orderRequest = true
            })
            .addCase(fetchOrderBurger.rejected, (state) => {
                state.orderRequest = false
            })
            .addCase(fetchFeeds.fulfilled, (state, action) => {
                state.orders = action.payload.orders
                state.ordersTotal = action.payload.total
                state.ordersToday = action.payload.totalToday
            })
            .addCase(fetchFeeds.rejected, (state, action) => {
                state.error = action.error.message!
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.userOrders = action.payload
            })
    }
})

export const { selectOrderModalData, selectOrderRequest, selectOrders, selectOrdersToday, selectOredersTotal, selectUserOrders } = ordersSlices.selectors
export const { closeOrderModalData } = ordersSlices.actions
export default ordersSlices.reducer
