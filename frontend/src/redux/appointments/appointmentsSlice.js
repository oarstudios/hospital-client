import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  createAppointmentApi,
  fetchAppointmentsApi,
  fetchAppointmentStatsApi,
  updateAppointmentApi,
  deleteAppointmentApi,
  restoreAppointmentApi,
} from './appointmentsApi';
import { APPOINTMENTS_INITIAL_STATE } from './appointmentsTypes';

// ─── Thunks ──────────────────────────────────────────────────────────────────

/** Create a booking — used by the public Book Appointment forms */
export const createAppointment = createAsyncThunk(
  'appointments/create',
  async (data, { rejectWithValue }) => {
    try {
      const res = await createAppointmentApi(data);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to book appointment');
    }
  },
);

/** Fetch ALL appointments — used by the admin Manage Appointments table */
export const fetchAppointments = createAsyncThunk(
  'appointments/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const res = await fetchAppointmentsApi(params);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch appointments');
    }
  },
);

/** Fetch booking counts — used by the admin dashboard count card */
export const fetchAppointmentStats = createAsyncThunk(
  'appointments/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetchAppointmentStatsApi();
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch appointment stats');
    }
  },
);

export const updateAppointment = createAsyncThunk(
  'appointments/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await updateAppointmentApi(id, data);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update appointment');
    }
  },
);

export const deleteAppointment = createAsyncThunk(
  'appointments/delete',
  async (id, { rejectWithValue }) => {
    try {
      await deleteAppointmentApi(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete appointment');
    }
  },
);

export const restoreAppointment = createAsyncThunk(
  'appointments/restore',
  async (id, { rejectWithValue }) => {
    try {
      const res = await restoreAppointmentApi(id);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to restore appointment');
    }
  },
);

// ─── Slice ───────────────────────────────────────────────────────────────────

const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState: APPOINTMENTS_INITIAL_STATE,

  reducers: {
    clearAppointmentsError(state) { state.error = null; },
  },

  extraReducers: (builder) => {
    const pending  = (state)         => { state.loading = true;  state.error = null; };
    const rejected = (state, action) => { state.loading = false; state.error = action.payload; };

    // createAppointment
    builder
      .addCase(createAppointment.pending, pending)
      .addCase(createAppointment.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) state.list.unshift(action.payload);
      })
      .addCase(createAppointment.rejected, rejected);

    // fetchAppointments (admin table — all records)
    builder
      .addCase(fetchAppointments.pending, pending)
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload || [];
      })
      .addCase(fetchAppointments.rejected, rejected);

    // fetchAppointmentStats (admin dashboard)
    builder
      .addCase(fetchAppointmentStats.pending, pending)
      .addCase(fetchAppointmentStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload || null;
      })
      .addCase(fetchAppointmentStats.rejected, rejected);

    // updateAppointment
    builder
      .addCase(updateAppointment.pending, pending)
      .addCase(updateAppointment.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        if (!updated) return;

        const idx = state.list.findIndex((a) => a.id === updated.id);
        if (idx !== -1) state.list[idx] = updated;
      })
      .addCase(updateAppointment.rejected, rejected);

    // deleteAppointment
    builder
      .addCase(deleteAppointment.pending, pending)
      .addCase(deleteAppointment.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.payload;
        state.list = state.list.filter((a) => a.id !== deletedId);
      })
      .addCase(deleteAppointment.rejected, rejected);

    // restoreAppointment
    builder
      .addCase(restoreAppointment.pending, pending)
      .addCase(restoreAppointment.fulfilled, (state, action) => {
        state.loading = false;
        const restored = action.payload;
        if (!restored) return;

        const alreadyInList = state.list.some((a) => a.id === restored.id);
        if (!alreadyInList) state.list.push(restored);
      })
      .addCase(restoreAppointment.rejected, rejected);
  },
});

export const { clearAppointmentsError } = appointmentsSlice.actions;
export default appointmentsSlice.reducer;