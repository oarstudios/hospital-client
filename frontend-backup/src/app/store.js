import { configureStore } from '@reduxjs/toolkit';
import authReducer    from '../redux/auth/authSlice';
import doctorsReducer from '../redux/doctors/doctorsSlice';
import centersReducer from '../redux/centers/centersSlice';
import servicesReducer from '../redux/services/servicesSlice';
import cancersReducer  from '../redux/cancers/cancersSlice';
import toastReducer    from '../redux/toast/toastSlice';   // ← new

import { toastMiddleware } from '../middleware/Toastmiddleware';

const store = configureStore({
  reducer: {
    auth:     authReducer,
    doctors:  doctorsReducer,
    centers:  centersReducer,
    services: servicesReducer,
    cancers:  cancersReducer,
    toast:    toastReducer,   // ← new
  },

  // configureStore ships with redux-thunk by default.
  // We extend the default middleware array and append our toastMiddleware.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(toastMiddleware), // ← new
});

export default store;