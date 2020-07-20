import React, { FunctionComponent } from 'react';
import { useSelector } from 'react-redux';
import { selectExpanded } from './rootSlice';
import {
  Switch,
  Route
} from 'react-router-dom';
import VersionSelector from '../views/VersionSelector';
import 'purecss';
import './App.css';

const App: FunctionComponent = () => {
  const expanded = useSelector(selectExpanded);

  return (
    <div className={expanded ? 'expanded': ''}>
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
};
export default App;
