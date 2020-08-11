import store from '../store';

test('get initial state', () => {
  const state = store.getState();
  expect(state.app).not.toBeUndefined();
  expect(state.room).not.toBeUndefined();
});
