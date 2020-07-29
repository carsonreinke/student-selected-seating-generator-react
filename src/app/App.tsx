import React, { FunctionComponent } from 'react';
import { useSelector } from 'react-redux';
import { selectExpanded } from './rootSlice';
import {
  Switch,
  Route
} from 'react-router-dom';
import 'purecss';
import './App.css';
import VersionSelector from '../views/VersionSelector';
import DeskEditor from '../views/DeskEditor';

const App: FunctionComponent = () => {
  const expanded = useSelector(selectExpanded);

  return (
    <div className={expanded ? 'expanded': ''}>
      <Switch>
        <Route path="/desks" >
          <DeskEditor />
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
