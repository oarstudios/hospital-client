import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchCentersApi,
  fetchCenterByIdApi,
  createCenterApi,
  updateCenterApi,
  deleteCenterApi,
  restoreCenterApi,
} from './centersApi';
import { CENTERS_INITIAL_STATE } from './centersTypes';

// ─── Thunks ──────────────────────────────────────────────────────────────────

export const fetchCenters = createAsyncThunk(
  'centers/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const res = await fetchCentersApi(params);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch centers');
    }
  },
);

export const fetchCenterById = createAsyncThunk(
  'centers/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetchCenterByIdApi(id);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Center not found');
    }
  },
);

export const createCenter = createAsyncThunk(
  'centers/create',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await createCenterApi(formData);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create center');
    }
  },
);

export const updateCenter = createAsyncThunk(
  'centers/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await updateCenterApi(id, data);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update center');
    }
  },
);

export const deleteCenter = createAsyncThunk(
  'centers/delete',
  async (id, { rejectWithValue }) => {
    try {
      await deleteCenterApi(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete center');
    }
  },
);

export const restoreCenter = createAsyncThunk(
  'centers/restore',
  async (id, { rejectWithValue }) => {
    try {
      const res = await restoreCenterApi(id);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to restore center');
    }
  },
);

// ─── Slice ───────────────────────────────────────────────────────────────────

const centersSlice = createSlice({
  name: 'centers',
  initialState: CENTERS_INITIAL_STATE,

  reducers: {
    clearSelectedCenter(state) { state.selected = null; },
    clearCentersError(state) { state.error = null; },
  },

  extraReducers: (builder) => {
    const pending = (state) => { state.loading = true; state.error = null; };
    const rejected = (state, action) => { state.loading = false; state.error = action.payload; };

    builder
      .addCase(fetchCenters.pending, pending)
      .addCase(fetchCenters.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload || [];
      })
      .addCase(fetchCenters.rejected, rejected);

    builder
      .addCase(fetchCenterById.pending, pending)
      .addCase(fetchCenterById.fulfilled, (state, action) => {
        state.loading = false;
        state.selected = action.payload;
      })
      .addCase(fetchCenterById.rejected, rejected);

    builder
      .addCase(createCenter.pending, pending)
      .addCase(createCenter.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) state.list.unshift(action.payload);
      })
      .addCase(createCenter.rejected, rejected);

    builder
      .addCase(updateCenter.pending, pending)
      .addCase(updateCenter.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.list.findIndex((c) => c.id === action.payload?.id);
        if (idx !== -1) state.list[idx] = action.payload;
        if (state.selected?.id === action.payload?.id) state.selected = action.payload;
      })
      .addCase(updateCenter.rejected, rejected);

    builder
      .addCase(deleteCenter.pending, pending)
      .addCase(deleteCenter.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter((c) => c.id !== action.payload);
      })
      .addCase(deleteCenter.rejected, rejected);

    builder
      .addCase(restoreCenter.pending, pending)
      .addCase(restoreCenter.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.list.findIndex((c) => c.id === action.payload?.id);
        if (idx !== -1) state.list[idx] = action.payload;
      })
      .addCase(restoreCenter.rejected, rejected);
  },
});

export const { clearSelectedCenter, clearCentersError } = centersSlice.actions;
export default centersSlice.reducer;