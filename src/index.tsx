import React from 'react';
import ReactDOM from 'react-dom';
import App from './app/App';
import { HashRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './app/store';
import { loadVersions } from './app/appSlice';

// Load all versions from local storage
store.dispatch(loadVersions(window.localStorage));

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById('app')
);
