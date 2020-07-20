import { configureMockStore } from '@jedmao/redux-mock-store';
import { ThunkDispatch } from 'redux-thunk';
import { getDefaultMiddleware, PayloadAction } from '@reduxjs/toolkit';

export function mockStore<S>(initialState: S) {
  return configureMockStore<
    S,
    PayloadAction,
    ThunkDispatch<S, null, PayloadAction>
  >(getDefaultMiddleware({
    serializableCheck: false
  }))(initialState);
}
