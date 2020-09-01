import React, { ReactNode, useState, useCallback, useEffect } from 'react';
import Header from '../components/Header';
import Room from '../components/Room';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentRoom, selectDeskCount, selectAllDesks, selectNewVersion, selectIsEmpty } from '../app/rootSlice';
import { moveDesk, rotateDesk, removeDesk, editName, addDesk, toggleNewVersion } from '../app/roomSlice';
import startOver from '../assets/images/start-over.svg';
import forward from '../assets/images/forward.svg';
import add from '../assets/images/add.svg';
import arrange from '../assets/images/arrange.svg';
import { Dimension } from '../models/general';

interface DeskEditorProps {
  menu: ReactNode;
  redirect: (path: string) => void;
}

export const DeskEditor = ({
  menu,
  redirect
}: DeskEditorProps) => {
  const dispatch = useDispatch();
  const [roomDimension, setRoomDimension] = useState<Dimension>({ width: 0, height: 0 }),
    [desksDimension, setDesksDimension] = useState<{ [id: string]: Dimension }>({}),
    [readyToArrange, setReadyToArrange] = useState([false, false]);
  const room = useSelector(selectCurrentRoom),
    deskCount = useSelector(selectDeskCount),
    allDesks = useSelector(selectAllDesks),
    newVersion = useSelector(selectNewVersion),
    isEmpty = useSelector(selectIsEmpty);

  // Redirect back if we have nothing in room
  useEffect(() => {
    if (isEmpty) {
      onStartOver();
    }
  });

  // Internal handlers
  const onStartOver = () => {
    redirect('/');
  };
  const onNext = () => {
    redirect('/students');
  };
  const onAddDesk = () => {
    dispatch(addDesk());
  };
  const onArrange = useCallback(() => {
    const containerRect = roomDimension;

    // Make there are desks to arrange
    if (deskCount === 0) {
      return;
    }

    const deskRect = Object.values(desksDimension)[0];
    if (!deskRect) {
      throw new Error('Missing a desk dimension');
    }

    // Calculate number of columns/rows
    const maxColumns = Math.floor(containerRect.width / deskRect.width),
      maxRows = Math.floor(containerRect.height / deskRect.height);
    if (maxColumns * maxRows < deskCount) {
      throw new Error('Too many desks to arrange');
    }

    // Change columns/rows to match the number of items
    let columns = 1, rows = 1;
    while (columns * rows < deskCount) {
      if (columns < rows && (columns < maxColumns || rows >= maxRows)) {
        columns++;
      }
      else {
        rows++;
      }
    }

    // Calculate column/row size and center position
    const width = containerRect.width / columns,
      height = containerRect.height / rows;
    const left = width / 2.0 - deskRect.width / 2.0,
      top = height / 2.0 - deskRect.height / 2.0;

    //Place each desk under column/row
    allDesks.forEach((desk, index) => {
      const column = index % columns,
        row = Math.floor(index / columns);
      dispatch(moveDesk(desk.id, column * width + left, row * height + top));
    });
  }, [dispatch, roomDimension, desksDimension, deskCount, allDesks]);

  // External handlers
  const onEditName = (name: string) => {
    dispatch(editName(name));
  };

  // Dimension call backs
  const onEditDimension = useCallback((rect: Dimension) => {
    setRoomDimension(rect);
    setReadyToArrange(previous => {
      return [true, previous[1]];
    });
  }, []);
  const onDeskEditDimension = useCallback((id: string, rect: Dimension) => {
    setDesksDimension(previous => {
      const dimensions = Object.assign({}, previous);
      dimensions[id] = rect;
      return dimensions;
    });
    setReadyToArrange(previous => {
      return [previous[0], true];
    });
  }, []);

  const onMoveDesk = (id: string, x: number, y: number) => {
    dispatch(moveDesk(id, x, y));
  };
  const onRotateDesk = (id: string, angle: number) => {
    dispatch(rotateDesk(id, angle));
  };
  const onRemoveDesk = (id: string) => {
    const dimensions = Object.assign({}, desksDimension);
    delete dimensions[id];
    setDesksDimension(dimensions);
    dispatch(removeDesk(id));
  };

  // Automatically arrange new room versions and after specifically state automatic arrangement has happened
  useEffect(() => {
    if (newVersion && readyToArrange.reduce((a, b) => a && b)) {
      onArrange();
      dispatch(toggleNewVersion(false));
    }
  }, [dispatch, readyToArrange, onArrange, newVersion])

  return (
    <div className="view-desk-editor">
      {menu}
      <nav className="pure-menu">
        <Header />
        <p>Provide the arrangement of desks for the room.</p>
        <ul className="pure-menu-list">
          <li className="pure-menu-item pure-menu-link" onClick={onNext}>
            <img src={forward} alt="Next" /> Next
            </li>
          <li className="pure-menu-item pure-menu-link" onClick={onStartOver}>
            <img src={startOver} alt="Start Over" /> Start Over
            </li>
        </ul>
        <h3>Edit</h3>
        <ul className="pure-menu-list menu-bottom">
          <li className="pure-menu-item pure-menu-link" onClick={onAddDesk}>
            <img src={add} alt="Add Desk" /> Add Desk
            </li>
          <li className="pure-menu-item pure-menu-link" onClick={onArrange}>
            <img src={arrange} alt="Arrange" /> Arrange
            </li>
        </ul>
      </nav>
      <main>
        <Room room={room} editable={true} editName={onEditName} editDimension={onEditDimension} moveDesk={onMoveDesk} rotateDesk={onRotateDesk} removeDesk={onRemoveDesk} deskEditDimension={onDeskEditDimension} />
      </main>
    </div>
  );
};

export default DeskEditor;
