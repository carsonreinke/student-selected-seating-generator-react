import React, { KeyboardEvent, FocusEvent, useRef, useEffect } from 'react';
import styles from './Room.module.css';
import Desk from './Desk';
import { toArray } from '../utils/collection';
import { Room as ModelRoom } from '../models/room';
import { Dimension } from '../models/general';
import ResizeObserver from 'resize-observer-polyfill';

interface RoomProps {
  editable: boolean;
  room: ModelRoom;
  moveDesk: (id: string, x: number, y: number) => void;
  rotateDesk: (id: string, angle: number) => void;
  removeDesk: (id: string) => void;
  editName: (name: string) => void;
  editDimension: (rect: Dimension) => void;
  deskEditDimension: (id: string, rect: Dimension) => void;
};

const Room = ({
  editable,
  room,
  moveDesk,
  rotateDesk,
  removeDesk,
  editName,
  editDimension,
  deskEditDimension
}: RoomProps) => {
  const container = useRef<HTMLDivElement>(null);
  let onBlur, onKeyDown;

  if (editable) {
    onBlur = (event: FocusEvent) => {
      editName((event.target as HTMLElement).innerText);
    };
    onKeyDown = (event: KeyboardEvent) => {
      // Ignore everything except "Enter"
      if (event.keyCode !== 13) {
        return;
      }

      event.preventDefault();
      (event.target as HTMLElement).blur();
    };
  }
  else {
    onBlur = onKeyDown = () => { };
  }

  // Provide dimensions to callback
  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        editDimension(entry.contentRect);
      }
    });
    observer.observe(container.current as HTMLElement);

    return () => observer.disconnect();
  }, [editDimension]);

  return (
    <div ref={container} className={styles.room}>
      <div className={styles.name}>
        <h2 contentEditable={editable} suppressContentEditableWarning={true} onBlur={onBlur} onKeyDown={onKeyDown}>{room.name}</h2>
      </div>
      {toArray(room.desks).map(desk => {
        const student = room.students.data[room.desks.students[desk.id][0]];

        return (
          <Desk key={desk.id} desk={desk} editable={editable} name={student?.name} move={moveDesk} rotate={rotateDesk} remove={removeDesk} editDimension={deskEditDimension} />
        );
      })}
    </div>
  );
}
export default Room;
