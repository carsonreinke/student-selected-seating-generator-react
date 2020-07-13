import React from 'react';
import {
  Switch,
  Route
} from 'react-router-dom';
import VersionSelector from '../views/VersionSelector';
import 'purecss';
import './App.css';

export default function App() {
  return (
    <div>
      <Switch>
        <Route path="/desks" >

        </Route>

        <Route path="/students">

        </Route>

        <Route path="/report">

        </Route>

        <Route path="/">
          <VersionSelector />
        </Route>
      </Switch>
    </div>
  );
}
