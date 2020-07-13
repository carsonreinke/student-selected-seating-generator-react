import React from 'react';
import {
  Switch,
  Route
} from 'react-router-dom';
import './App.css';

function App() {
  return (
    <div className="App">
      <Switch>
        <Route path="/desks" >

        </Route>

        <Route path="/students">

        </Route>

        <Route path="/report">

        </Route>

        <Route path="/">

        </Route>
      </Switch>
    </div>
  );
}

export default App;
