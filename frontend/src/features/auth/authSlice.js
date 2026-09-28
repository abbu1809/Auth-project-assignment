import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { authApi } from '../../services/api';

const savedToken = sessionStorage.getItem('accessToken');
const savedUser = sessionStorage.getItem('user');

export const registerUser = createAsyncThunk('auth/register', authApi.register);
export const loginUser = createAsyncThunk('auth/login', authApi.login);
export const loadCurrentUser = createAsyncThunk(
  'auth/me',
  async (_, { rejectWithValue }) => {
    try {
      return await authApi.me();
    } catch (error) {
      try {
        return await authApi.refresh();
      } catch {
        return rejectWithValue(error.message);
      }
    }
  }
);
export const logoutUser = createAsyncThunk('auth/logout', authApi.logout);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    accessToken: savedToken,
    user: savedUser ? JSON.parse(savedUser) : null,
    status: 'idle',
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.accessToken = action.payload.data.accessToken;
        state.user = action.payload.data.user;
        sessionStorage.setItem('accessToken', state.accessToken);
        sessionStorage.setItem('user', JSON.stringify(state.user));
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.accessToken = action.payload.data.accessToken;
        state.user = action.payload.data.user;
        sessionStorage.setItem('accessToken', state.accessToken);
        sessionStorage.setItem('user', JSON.stringify(state.user));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(loadCurrentUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.data.user;
        if (action.payload.data.accessToken)
          state.accessToken = action.payload.data.accessToken;
        sessionStorage.setItem('user', JSON.stringify(state.user));
        if (state.accessToken)
          sessionStorage.setItem('accessToken', state.accessToken);
      })
      .addCase(loadCurrentUser.rejected, (state) => {
        state.status = 'failed';
        state.accessToken = null;
        state.user = null;
        sessionStorage.clear();
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.accessToken = null;
        state.user = null;
        state.status = 'idle';
        sessionStorage.clear();
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
