import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../redux/auth/authSlice';
import doctorsReducer from '../redux/doctors/doctorsSlice';
import centersReducer from '../redux/centers/centersSlice';
import servicesReducer from '../redux/services/servicesSlice';
import cancersReducer from '../redux/cancers/cancersSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    doctors: doctorsReducer,
    centers: centersReducer,
    services: servicesReducer,
    cancers: cancersReducer,
  },
});

export default store;