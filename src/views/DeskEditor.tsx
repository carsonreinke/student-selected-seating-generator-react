import React, { ReactNode } from 'react';
import Header from '../components/Header';
import Room from '../components/Room';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentRoom } from '../app/rootSlice';
import { moveDesk, rotateDesk, removeDesk } from '../app/roomSlice';

interface DeskEditorProps {
  menu: ReactNode;
}

export const DeskEditor = ({ menu }: DeskEditorProps) => {
  const dispatch = useDispatch();
  const room = useSelector(selectCurrentRoom);

  const onEditName = () => {
    //TODO
  };
  const onMoveDesk = (id: string, x: number, y: number) => {
    dispatch(moveDesk(id, x, y));
  };
  const onRotateDesk = (id: string, angle: number) => {
    dispatch(rotateDesk(id, angle));
  };
  const onRemoveDesk = (id: string) => {
    dispatch(removeDesk(id));
  };

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
        <Room room={room} editable={true} editName={onEditName} moveDesk={onMoveDesk} rotateDesk={onRotateDesk} removeDesk={onRemoveDesk} />
      </main>
    </div>
  );
};

export default DeskEditor;
