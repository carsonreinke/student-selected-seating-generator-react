import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Hamburger from '../components/Hamburger';
import Header from '../components/Header';
import { selectExpanded } from '../app/rootSlice';
import { toggle } from '../app/appSlice';

export const DeskEditor = () => {
  const expanded = useSelector(selectExpanded);
  const history = useHistory();

  const dispatch = useDispatch();
  const onToggle = useCallback(
    () => dispatch(toggle()),
    [dispatch]
  );

  return (
    <div>
      <Hamburger expanded={expanded} toggle={onToggle} />
      <nav className="pure-menu">
        <Header />
        <p>Provide the arrangement of desks for the room.</p>
        {
        /*<ul class="pure-menu-list">
          <li class="pure-menu-item pure-menu-link" @click="next">
            <img src="../assets/images/forward.svg" alt="Next" /> Next
          </li>
          <li class="pure-menu-item pure-menu-link" @click="startOver">
            <img src="../assets/images/start-over.svg" alt="Start Over" /> Start Over
          </li>
        </ul>
        <h3>Edit</h3>
        <ul class="pure-menu-list menu-bottom">
          <li class="pure-menu-item pure-menu-link" @click="addDesk">
            <img src="../assets/images/add.svg" alt="Add Desk" /> Add Desk
          </li>
          <li class="pure-menu-item pure-menu-link" @click="arrange">
            <img src="../assets/images/arrange.svg" alt="Arrange" /> Arrange
          </li>
        </ul>*/
        }
      </nav>
      <main>
        {/*<Room editable />*/}
      </main>
    </div>
  );
};

export default DeskEditor;
