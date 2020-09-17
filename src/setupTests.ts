// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';

window.print = jest.fn();
window.alert = jest.fn();

const localStorage = (() => {
  let store = {}
  return {
    length: 0,
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn()
  }
})();
Object.defineProperty(window, 'localStorage', {
  value: localStorage,
});
