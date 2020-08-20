import React, { KeyboardEvent, FocusEvent } from 'react';
import styles from './Room.module.css';
import Desk from './Desk';
import { toArray } from '../utils/collection';
import { Room as ModelRoom } from '../models/room';

interface RoomProps {
  editable: boolean;
  room: ModelRoom;
  moveDesk: (id: string, x: number, y: number) => void;
  rotateDesk: (id: string, angle: number) => void;
  removeDesk: (id: string) => void;
  editName: (name: string) => void;
};

const Room = ({
  editable,
  room,
  moveDesk,
  rotateDesk,
  removeDesk,
  editName
}: RoomProps) => {
  let onBlur, onKeyDown;

  if (editable) {
    onBlur = (event: FocusEvent) => {
      editName((event.target as HTMLElement).innerText);
    };
    onKeyDown = (event: KeyboardEvent) => {
      // Ignore everything except "Enter"
      if(event.keyCode !== 13) {
        return;
      }

      event.preventDefault();
      (event.target as HTMLElement).blur();
    };
  }
  else {
    onBlur = onKeyDown = () => { };
  }

  return (
    <div className={styles.room}>
      <div className={styles.name}>
        <h2 contentEditable={editable} suppressContentEditableWarning={true} onBlur={onBlur} onKeyDown={onKeyDown}>{room.name}</h2>
      </div>
      {toArray(room.desks).map(desk => {
        const student = room.students.data[room.desks.students[desk.id][0]];

        return (
          <Desk key={desk.id} desk={desk} editable={editable} name={student?.name} move={moveDesk} rotate={rotateDesk} remove={removeDesk} />
        );
      })}
    </div>
  );
}
export default Room;
