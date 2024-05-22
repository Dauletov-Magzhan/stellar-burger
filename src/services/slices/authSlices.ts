import { TLoginData, TRegisterData, forgotPasswordApi, getUserApi, loginUserApi, logoutApi, registerUserApi, updateUserApi } from "@api";
import { PayloadAction, createAsyncThunk, createSlice, isAction, } from "@reduxjs/toolkit";
import { TUser } from "@utils-types";
import { deleteCookie, setCookie } from "../../utils/cookie";

const ACCESS_TOKEN = 'accessToken'
const REFRESH_TOKEN = 'refreshToken'

interface AuthState {
    user: TUser
    isAuthChecked: boolean
    errorText: string 
    isLoading: boolean
    accessToken: string | null
}

const initialState: AuthState = {
    user: {
        name: '',
        email: ''
      },
    isAuthChecked: false,
    errorText: '',
    isLoading: false,
    accessToken: null
}

export const register = createAsyncThunk(
    'auth/register',
    async (data: TRegisterData, thunkApi) => {
        try{   
            const res = await registerUserApi(data)
            return res
        } catch(err) {
            return thunkApi.rejectWithValue(err)
        }
    }
)

export const login = createAsyncThunk(
    'auth/login',
    async (data: TLoginData, thunkApi) => {
        try{
            const res = await loginUserApi(data)
            return res
        } catch (err) {
            return thunkApi.rejectWithValue(err)
        }
    }
)

export const logout = createAsyncThunk(
    'auth/logout',
    async (_, thunkApi) => {
        try{
            const res = await logoutApi()
            return res
        } catch (err) {
            return thunkApi.rejectWithValue(err)
        }
    }
)

export const updateUser = createAsyncThunk(
    'auth/updateUser',
    async (data: Partial<TRegisterData>, thunkApi) => {
        try{
            const res = await updateUserApi(data)
            return res
        } catch (err) {
            return thunkApi.rejectWithValue(err)
        }
    }
)

export const getUser = createAsyncThunk(
    'auth/getUser',
    async (_, thunkApi) => {
        try{
            const res = await getUserApi()
            return res
        } catch (err) {
            return thunkApi.rejectWithValue(err)
        }
    }
)

export const authSlices = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        removeErrorText(state) {
            state.errorText = ''
        }
    },
    selectors: {
        selectGetUser: (state) => {
            return state.user
        },
        selectIsAuthChecked: (state) => {
            return state.isAuthChecked
        },
        selectGetError: (state) => {
            return state.errorText
        },
        selectIsLoading: (state) => {
            return state.isLoading
        },
    },
    extraReducers(builder) {
        builder
        .addCase(register.fulfilled, (state, action) => {
            setCookie(ACCESS_TOKEN, action.payload.accessToken)
            localStorage.setItem(REFRESH_TOKEN, action.payload.refreshToken)
            state.isAuthChecked = true
            state.isLoading = false
        })
        .addCase(register.pending, (state) => {
            state.isLoading = true
        })
        .addCase(register.rejected, (state, action) => {
            state.isLoading = false
            state.errorText = action.error.message!
        })
        .addCase(login.fulfilled, (state, action) => {
            setCookie(ACCESS_TOKEN, action.payload.accessToken)
            localStorage.setItem(REFRESH_TOKEN, action.payload.refreshToken)
            state.isAuthChecked = true
            state.isLoading = false
        })
        .addCase(login.pending, (state) => {
            state.isLoading = true
        })
        .addCase(login.rejected, (state, action) => {
            state.isLoading = false
            state.errorText = action.error.message!
        })
        .addCase(logout.fulfilled, (state) => {
            deleteCookie(ACCESS_TOKEN)
            localStorage.removeItem(REFRESH_TOKEN)
            state.user = {
                name: '',
                email: ''
            }
            state.isAuthChecked = false
            state.isLoading =false
        })
        .addCase(logout.pending, (state) => {
            state.isLoading = true
        })
        .addCase(logout.rejected, (state, action) => {
            state.isLoading = false
            state.errorText = action.error.message!
        })
        .addCase(getUser.fulfilled, (state, action) => {
            state.isLoading = false
            state.user.email = action.payload.user.email
            state.user.name = action.payload.user.name
            state.isAuthChecked = true
            state.accessToken = localStorage.getItem(REFRESH_TOKEN)
        })
        .addCase(getUser.pending, (state) => {
            state.isLoading = true
        })
        .addCase(getUser.rejected, (state, action) => {
            state.isLoading =false
            state.isAuthChecked = false
            state.errorText = action.error.message!
            state.user = {
                name: '',
                email: ''
            }
            deleteCookie(ACCESS_TOKEN)
            localStorage.removeItem(REFRESH_TOKEN)
        })
        .addCase(updateUser.fulfilled, (state, action) => {
            state.isLoading = false;
            if (action.payload.success) {
              state.user.name = action.payload.user.name;
              state.user.email = action.payload.user.email;
            }
        })
        .addCase(updateUser.pending, (state) => {
            state.isLoading = true
        })
        .addCase(updateUser.rejected, (state) => {
            state.isLoading = false
        })
    },
})




export const { removeErrorText } = authSlices.actions
export const { selectGetUser, selectIsAuthChecked, selectGetError, selectIsLoading } = authSlices.selectors
export default authSlices.reducer
