import { configureStore } from '@reduxjs/toolkit';
import ordersSlices, {
  closeOrderModalData,
  fetchFeeds,
  fetchOrderBurger,
  fetchOrders,
  selectOrderModalData,
  selectOrderRequest,
  selectOrders,
  selectOrdersToday,
  selectOredersTotal,
  selectUserOrders
} from '../slices/ordersSlices';
import { orderMockStore } from '../mocks/ordersSlicesMocks';

const initialStore = () =>
  configureStore({
    reducer: {
      orders: ordersSlices
    },
    preloadedState: {
      orders: orderMockStore
    }
  });

describe('Тест OrdersSlices', () => {
  let store: any;

  beforeEach(() => {
    store = initialStore();
  });

  it('Тест редюсера closeOrderModalData', () => {
    const store = initialStore();
    store.dispatch(closeOrderModalData());
    const orderModalData = store.getState().orders.orderModalData;
    const orderRequest = store.getState().orders.orderRequest;
    expect(orderModalData).toBe(null);
    expect(orderRequest).toBe(false);
  });

  it('Тест селектора closeOrderModalData', () => {
    const store = initialStore();
    const orderModalData = selectOrderModalData(store.getState());
    expect(orderModalData).toEqual(orderMockStore.orderModalData);
  });

  it('Тест селектора selectOrderRequest', () => {
    const store = initialStore();
    const orderRequest = selectOrderRequest(store.getState());
    expect(orderRequest).toEqual(orderMockStore.orderRequest);
  });

  it('Тест селектора selectOrders', () => {
    const store = initialStore();
    const orders = selectOrders(store.getState());
    expect(orders).toEqual(orderMockStore.orders);
  });

  it('Тест селектора selectOredersTotal', () => {
    const store = initialStore();
    const ordersTotal = selectOredersTotal(store.getState());
    expect(ordersTotal).toEqual(orderMockStore.ordersTotal);
  });

  it('Тест селектора selectOrdersToday', () => {
    const store = initialStore();
    const ordersToday = selectOrdersToday(store.getState());
    expect(ordersToday).toEqual(orderMockStore.ordersToday);
  });

  it('Тест селектора selectOrdersToday', () => {
    const store = initialStore();
    const ordersToday = selectOrdersToday(store.getState());
    expect(ordersToday).toEqual(orderMockStore.ordersToday);
  });

  it('Тест селектора selectOrdersToday', () => {
    const store = initialStore();
    const userOrders = selectUserOrders(store.getState());
    expect(userOrders).toEqual(orderMockStore.userOrders);
  });

  it('Тест асинхронного экшена fetchOrderBurger.pending', () => {
    const action = { type: fetchOrderBurger.pending.type };
    const state = ordersSlices(store.getState(), action);
    expect(state.orderRequest).toBe(true);
  });

  it('Тест асинхронного экшена fetchOrderBurger.fulfilled', () => {
    const action = {
      type: fetchOrderBurger.fulfilled.type,
      payload: { order: { _id: '1', name: 'burger' } }
    };
    const state = ordersSlices(store.getState(), action);
    expect(state.orderModalData?._id).toEqual('1');
    expect(state.orderModalData?.name).toEqual('burger');
    expect(state.orderRequest).toBe(false);
  });

  it('Тест асинхронного экшена fetchOrderBurger.rejected', () => {
    const action = { type: fetchOrderBurger.rejected.type };
    const state = ordersSlices(store.getState(), action);
    expect(state.orderRequest).toBe(false);
  });

  it('Тест асинхронного экшена fetchFeeds.fulfilled', () => {
    const action = {
      type: fetchFeeds.fulfilled.type,
      payload: {
        orders: [
          { _id: '1', name: 'burger' },
          { _id: '2', name: 'sous' }
        ],
        total: 1000,
        totalToday: 100
      }
    };
    const state = ordersSlices(store.getState(), action);
    expect(state.orders.length).toBe(2);
    expect(state.orders[1].name).toBe('sous');
    expect(state.ordersTotal).toBe(1000);
    expect(state.ordersToday).toBe(100);
  });

  it('Тест асинхронного экшена fetchFeeds.rejected', () => {
    const action = {
      type: fetchFeeds.rejected.type,
      error: { message: 'Error' }
    };
    const state = ordersSlices(store.getState(), action);
    expect(state.error).toBe('Error');
  });

  it('Тест асинхронного экшена fetchOrders.fulfilled', () => {
    const action = {
      type: fetchOrders.fulfilled.type,
      payload: [
        { _id: '1', name: 'burger' },
        { _id: '2', name: 'sous' },
        { _id: '3', name: 'burger2' },
        { _id: '4', name: 'burger3' }
      ]
    };
    const state = ordersSlices(store.getState(), action);
    expect(state.userOrders.length).toBe(4);
    expect(state.userOrders[3]._id).toBe('4');
    expect(state.userOrders[3].name).toBe('burger3');
  });
});
