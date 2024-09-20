import { configureStore } from '@reduxjs/toolkit';
import snippetReducer from './snippetSlice';

export const store = configureStore({
  reducer: {
    snippet: snippetReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;