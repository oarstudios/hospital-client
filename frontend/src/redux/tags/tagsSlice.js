import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../app/axiosinstance';

export const fetchTags = createAsyncThunk(
  'tags/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/tags');
      return res.data.data || res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch tags');
    }
  },
);

// Creates a new tag (or returns the existing one if the name already
// matches something stored) — used by the admin blog form's "type a
// new tag" flow so a brand-new category gets a real id right away.
export const createTag = createAsyncThunk(
  'tags/create',
  async (tagName, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post('/tags', { tag: tagName });
      return res.data.data || res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create tag');
    }
  },
);

export const deleteTag = createAsyncThunk(
  'tags/delete',
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/tags/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete tag');
    }
  },
);

const tagsSlice = createSlice({
  name: 'tags',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTags.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTags.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload || [];
      })
      .addCase(fetchTags.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(createTag.fulfilled, (state, action) => {
        const newTag = action.payload;
        if (!newTag) return;
        // Avoid duplicating it in the list if it already existed
        // (the backend can return an existing tag for a name match).
        const alreadyInList = state.list.some((t) => t.id === newTag.id);
        if (!alreadyInList) state.list.push(newTag);
      })
      .addCase(createTag.rejected, (state, action) => {
        state.error = action.payload;
      });

    builder
      .addCase(deleteTag.fulfilled, (state, action) => {
        state.list = state.list.filter((t) => t.id !== action.payload);
      })
      .addCase(deleteTag.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default tagsSlice.reducer;