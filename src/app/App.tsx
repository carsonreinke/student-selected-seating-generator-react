import React, { FunctionComponent, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectExpanded } from './rootSlice';
import {
  Switch,
  Route
} from 'react-router-dom';
import 'purecss';
import './App.css';
import VersionSelector from '../views/VersionSelector';
import DeskEditor from '../views/DeskEditor';
import { toggle } from './appSlice';
import Hamburger from '../components/Hamburger';

const App: FunctionComponent = () => {
  const expanded = useSelector(selectExpanded);
  const dispatch = useDispatch();
  const onToggle = useCallback(
    () => dispatch(toggle()),
    [dispatch]
  );

  const menu = () => {
    return (
      <Hamburger expanded={expanded} toggle={onToggle} />
    );
  };

  return (
    <div className={expanded ? 'expanded' : ''}>
      <Switch>
        <Route path="/desks" >
          <DeskEditor menu={menu()} />
        </Route>

        <Route path="/students">

        </Route>

        <Route path="/report">

        </Route>

        <Route path="/">
          <VersionSelector menu={menu()} />
        </Route>
      </Switch>
    </div>
  );
};
export default App;
