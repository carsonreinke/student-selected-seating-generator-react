import store from '../store';

it('should get initial state', () => {
  const state = store.getState();
  expect(state.app).not.toBeUndefined();
  expect(state.room).not.toBeUndefined();
});
