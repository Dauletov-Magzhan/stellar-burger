import { configureStore } from '@reduxjs/toolkit';
import authSlices, {
  getUser,
  initialState,
  login,
  logout,
  register,
  selectGetError,
  selectGetUser,
  selectIsAuthChecked,
  selectIsLoading
} from '../slices/authSlices';
import { authMockStore } from '../mocks/authSlicesMocks';
import { setCookie } from '../../utils/cookie';
import 'jest-localstorage-mock';

const initialStore = () =>
  configureStore({
    reducer: {
      auth: authSlices
    },
    preloadedState: {
      auth: authMockStore
    }
  });

jest.mock('../../utils/cookie', () => ({
  setCookie: jest.fn(),
  getCookie: jest.fn(),
  deleteCookie: jest.fn()
}));

describe('Тест authSlices', () => {
  let store: any;
  beforeEach(() => {
    store = initialStore();
  });

  it('Тест селектора selectGetUser', () => {
    const store = initialStore();
    const getUser = selectGetUser(store.getState());
    expect(getUser).toEqual(authMockStore.user);
  });

  it('Тест селектора selectIsAuthChecked', () => {
    const store = initialStore();
    const isAuthChecked = selectIsAuthChecked(store.getState());
    expect(isAuthChecked).toEqual(authMockStore.isAuthChecked);
  });

  it('Тест селектора selectGetError', () => {
    const store = initialStore();
    const getError = selectGetError(store.getState());
    expect(getError).toEqual(authMockStore.errorText);
  });

  it('Тест селектора selectIsLoading', () => {
    const store = initialStore();
    const isLoading = selectIsLoading(store.getState());
    expect(isLoading).toEqual(authMockStore.isLoading);
  });

  it('Тест асинхронного экшена getUser.pending', () => {
    const state = authSlices(initialState, getUser.pending(''));

    expect(state.isLoading).toBe(true);
  });

  it('Тест асинхронного экшена getUser.fulfilled', () => {
    const mockFulfilled = {
      success: true,
      user: authMockStore.user
    };

    const state = authSlices(
      initialState,
      getUser.fulfilled(mockFulfilled, '')
    );
    expect(state.user).toEqual(mockFulfilled.user);
  });

  it('Тест асинхронного экшена getUser.rejected', () => {
    const mockRejected = { name: 'test', message: 'text error' };
    const state = authSlices(initialState, getUser.rejected(mockRejected, ''));

    expect(state.isLoading).toBe(false);
    expect(state.isAuthChecked).toBe(false);
    expect(state.errorText).toEqual('text error');
    expect(state.user).toEqual({ name: '', email: '' });
    expect(localStorage.getItem('refreshToken')).toBeNull();
  });

  it('Тест асинхронного экшена register.pending', () => {
    const action = { type: register.pending.type };
    const state = authSlices(store.getState(), action);
    expect(state.isLoading).toBe(true);
  });

  it('Тест асинхронного экшена register.fulfilled', () => {
    localStorage.clear();

    const initialState = {
      user: { name: '', email: '' },
      isAuthChecked: false,
      errorText: '',
      isLoading: false,
      accessToken: null
    };

    const action = {
      type: register.fulfilled.type,
      payload: {
        accessToken: 'testAccessToken',
        refreshToken: 'testRefreshToken'
      }
    };

    const state = authSlices(initialState, action);

    expect(setCookie).toHaveBeenCalledWith('accessToken', 'testAccessToken');
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'refreshToken',
      'testRefreshToken'
    );
    expect(state.isAuthChecked).toBe(true);
    expect(state.isLoading).toBe(false);
  });

  it('Тест асинхронного экшена register.rejected', () => {
    const action = {
      type: register.rejected.type,
      error: { message: 'Error' }
    };
    const state = authSlices(store.getState(), action);
    expect(state.isLoading).toBe(false);
    expect(state.errorText).toBe('Error');
  });

  it('Тест асинхронного экшена login.pending', () => {
    const action = { type: login.pending.type };
    const state = authSlices(store.getState(), action);
    expect(state.isLoading).toBe(true);
  });

  it('Тест асинхронного экшена login.fulfilled', () => {
    const initialState = {
      user: { name: '', email: '' },
      isAuthChecked: false,
      errorText: '',
      isLoading: false,
      accessToken: null
    };

    const action = {
      type: login.fulfilled.type,
      payload: {
        accessToken: 'testAccessToken',
        refreshToken: 'testRefreshToken'
      }
    };
    const state = authSlices(initialState, action);

    expect(setCookie).toHaveBeenCalledWith('accessToken', 'testAccessToken');
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'refreshToken',
      'testRefreshToken'
    );
    expect(state.isAuthChecked).toBe(true);
    expect(state.isLoading).toBe(false);
  });

  it('Тест асинхронного экшена login.rejected', () => {
    const action = { type: login.rejected.type, error: { message: 'Error' } };
    const state = authSlices(store.getState(), action);
    expect(state.isLoading).toBe(false);
    expect(state.errorText).toBe('Error');
  });

  it('Тест асинхронного экшена logout.pending', () => {
    const action = { type: logout.pending.type };
    const state = authSlices(store.getState(), action);
    expect(state.isLoading).toBe(true);
  });

  it('Тест асинхронного экшена logout.fulfilled', () => {
    const action = { type: logout.fulfilled.type };
    const state = authSlices(store.getState(), action);
    expect(document.cookie).not.toContain('accessToken');
    expect(localStorage.getItem('refreshToken')).toBeNull();
  });

  it('Тест асинхронного экшена logout.rejected', () => {
    const action = { type: logout.rejected.type, error: { message: 'Error' } };
    const state = authSlices(store.getState(), action);
    expect(state.isLoading).toBe(false);
    expect(state.errorText).toBe('Error');
  });
});
