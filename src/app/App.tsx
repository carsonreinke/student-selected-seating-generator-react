import React, { FunctionComponent, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectExpanded } from './rootSlice';
import {
  Switch,
  Route,
  useHistory
} from 'react-router-dom';
import 'purecss';
import './App.css';
import VersionSelector from '../views/VersionSelector';
import DeskEditor from '../views/DeskEditor';
import StudentEditor from '../views/StudentEditor';
import ReportViewer from '../views/ReportViewer';
import { toggle } from './appSlice';
import Hamburger from '../components/Hamburger';

const App: FunctionComponent = () => {
  const expanded = useSelector(selectExpanded);
  const dispatch = useDispatch();
  const history = useHistory();

  const onToggle = useCallback(
    () => dispatch(toggle()),
    [dispatch]
  );

  const onRedirect = (path: string) => {
    history.push(path);
  }

  const menu = () => {
    return (
      <Hamburger expanded={expanded} toggle={onToggle} />
    );
  };

  return (
    <div className={expanded ? 'expanded' : ''}>
      <Switch>
        <Route path="/desks" >
          <DeskEditor menu={menu()} redirect={onRedirect} />
        </Route>

        <Route path="/students">
          <StudentEditor menu={menu()} redirect={onRedirect} />
        </Route>

        <Route path="/report">
          <ReportViewer menu={menu()} redirect={onRedirect} />
        </Route>

        <Route path="/">
          <VersionSelector menu={menu()} redirect={onRedirect} />
        </Route>
      </Switch>
    </div>
  );
};
export default App;
