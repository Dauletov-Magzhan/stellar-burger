import {
  getFeedsApi,
  getOrderByNumberApi,
  getOrdersApi,
  orderBurgerApi
} from '../../utils/burger-api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TConstructorItems, TIngredient, TOrder } from '@utils-types';

interface OrderInitialState {
  ingredients: TIngredient[];
  orderModalData: TOrder | null;
  orders: TOrder[];
  ordersTotal: number;
  ordersToday: number;
  orderRequest: boolean;
  userOrders: TOrder[];
  constructorItems: TConstructorItems;
  error: string;
  userOrdersByNumber: TOrder[];
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
      price: 0
    },
    ingredients: []
  },
  userOrders: [],
  error: '',
  userOrdersByNumber: []
};

export const fetchOrderBurger = createAsyncThunk(
  'order/orderBurger',
  async (data: string[]) => orderBurgerApi(data)
);

export const fetchFeeds = createAsyncThunk('order/feeds', async () =>
  getFeedsApi()
);

export const fetchOrders = createAsyncThunk('order/orders', async () =>
  getOrdersApi()
);

export const fetchOrderByNumber = createAsyncThunk(
  'order/OrderByNumber',
  async (number: number) => getOrderByNumberApi(number)
);

export const ordersSlices = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    closeOrderModalData(state) {
      state.orderRequest = false;
      state.orderModalData = null;
    }
  },
  selectors: {
    selectOrderModalData: (state) => state.orderModalData,
    selectOrderRequest: (state) => state.orderRequest,
    selectOrders: (state) => state.orders,
    selectOredersTotal: (state) => state.ordersTotal,
    selectOrdersToday: (state) => state.ordersToday,
    selectUserOrders: (state) => state.userOrders,
    selectUserOrdersByNumber: (state) => state.userOrdersByNumber
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderBurger.fulfilled, (state, action) => {
        state.orderModalData = action.payload.order;
        state.constructorItems = {
          bun: {
            price: 0
          },
          ingredients: []
        }
        state.orderRequest = false;
      })
      .addCase(fetchOrderBurger.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(fetchOrderBurger.rejected, (state) => {
        state.orderRequest = false;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.orders = action.payload.orders;
        state.ordersTotal = action.payload.total;
        state.ordersToday = action.payload.totalToday;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.error = action.error.message!;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.userOrders = action.payload;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.userOrdersByNumber = action.payload.orders;
      });
  }
});

export const {
  selectOrderModalData,
  selectOrderRequest,
  selectOrders,
  selectOrdersToday,
  selectOredersTotal,
  selectUserOrders,
  selectUserOrdersByNumber
} = ordersSlices.selectors;
export const { closeOrderModalData } = ordersSlices.actions;
export default ordersSlices.reducer;
