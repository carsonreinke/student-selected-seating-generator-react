import React, { ReactNode } from 'react';
import Header from '../components/Header';

interface DeskEditorProps {
  menu: ReactNode;
}

export const DeskEditor = ({ menu }: DeskEditorProps) => {
  return (
    <div className="view-desk-editor">
      {menu}
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
