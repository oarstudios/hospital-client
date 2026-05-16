import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchTagsApi } from './tagsApi';
import { TAGS_INITIAL_STATE } from './tagsTypes';

export const fetchTags = createAsyncThunk(
  'tags/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetchTagsApi();
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch tags');
    }
  },
);

const tagsSlice = createSlice({
  name: 'tags',
  initialState: TAGS_INITIAL_STATE,

  reducers: {
    clearTagsError(state) { state.error = null; },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchTags.pending,  (state)         => { state.loading = true;  state.error = null; })
      .addCase(fetchTags.fulfilled,(state, action) => { state.loading = false; state.list = action.payload || []; })
      .addCase(fetchTags.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const { clearTagsError } = tagsSlice.actions;
export default tagsSlice.reducer;