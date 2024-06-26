import {
  TLoginData,
  TRegisterData,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  updateUserApi
} from '../../utils/burger-api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { deleteCookie, getCookie, setCookie } from '../../utils/cookie';

interface AuthState {
  user: TUser;
  isAuthChecked: boolean;
  errorText: string;
  isLoading: boolean;
  accessToken: string | null;
}

export const initialState: AuthState = {
  user: {
    name: '',
    email: ''
  },
  isAuthChecked: false,
  errorText: '',
  isLoading: false,
  accessToken: null
};

export const register = createAsyncThunk(
  'auth/register',
  async (data: TRegisterData) => registerUserApi(data)
);

export const login = createAsyncThunk('auth/login', async (data: TLoginData) =>
  loginUserApi(data)
);

export const logout = createAsyncThunk('auth/logout', async () => logoutApi());

export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (data: Partial<TRegisterData>) => updateUserApi(data)
);

export const getUser = createAsyncThunk('auth/getUser', async () =>
  getUserApi()
);

export const authSlices = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    initializeAuth(state) {
      const accessToken = getCookie('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      if (accessToken && refreshToken) {
        state.accessToken = accessToken;
        state.isAuthChecked = true;
      } else {
        state.isAuthChecked = false;
        state.accessToken = null;
      }
    }
  },
  selectors: {
    selectGetUser: (state) => state.user,
    selectIsAuthChecked: (state) => state.isAuthChecked,
    selectGetError: (state) => state.errorText,
    selectIsLoading: (state) => state.isLoading
  },
  extraReducers(builder) {
    builder
      .addCase(register.fulfilled, (state, action) => {
        setCookie('accessToken', action.payload.accessToken);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
        state.isAuthChecked = true;
        state.isLoading = false;
      })
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.errorText = action.error.message!;
      })
      .addCase(login.fulfilled, (state, action) => {
        setCookie('accessToken', action.payload.accessToken);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
        state.isAuthChecked = true;
        state.isLoading = false;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.errorText = action.error.message!;
      })
      .addCase(logout.fulfilled, (state) => {
        deleteCookie('accessToken');
        localStorage.removeItem('refreshToken');
        state.user = {
          name: '',
          email: ''
        };
        state.isAuthChecked = false;
        state.isLoading = false;
      })
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.errorText = action.error.message!;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user.email = action.payload.user.email;
        state.user.name = action.payload.user.name;
        state.isAuthChecked = true;
        state.accessToken = localStorage.getItem('refreshToken');
      })
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthChecked = false;
        state.errorText = action.error.message!;
        state.user = {
          name: '',
          email: ''
        };
        deleteCookie('accessToken');
        localStorage.removeItem('refreshToken');
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          state.user.name = action.payload.user.name;
          state.user.email = action.payload.user.email;
        }
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUser.rejected, (state) => {
        state.isLoading = false;
      });
  }
});

export const { initializeAuth } = authSlices.actions;
export const {
  selectGetUser,
  selectIsAuthChecked,
  selectGetError,
  selectIsLoading
} = authSlices.selectors;
export default authSlices.reducer;
