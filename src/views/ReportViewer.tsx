import React, { ReactNode, useEffect } from 'react';
import Header from '../components/Header';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentRoom, selectIsEmpty } from '../app/rootSlice';
import Room from '../components/Room';
import startOver from '../assets/images/start-over.svg';
import back from '../assets/images/back.svg';
import save from '../assets/images/save.svg';
import print from '../assets/images/print.svg';
import { saveVersion } from '../app/appSlice';

interface ReportViewerProps {
  menu: ReactNode;
  redirect: (path: string) => void;
}

export const ReportViewer = ({
  menu,
  redirect
}: ReportViewerProps) => {
  const dispatch = useDispatch();
  const room = useSelector(selectCurrentRoom),
    isEmpty = useSelector(selectIsEmpty);

  // Redirect back if we have nothing in room
  useEffect(() => {
    if (isEmpty) {
      onStartOver();
    }
  });

  // Internal handlers
  const onStartOver = () => redirect('/');
  const onPrevious = () => redirect('/students');
  const onPrint = window.print;
  const onSave = async () => {
    await dispatch(saveVersion(window.localStorage, room));
    window.alert("Room has been saved");
  };

  return (
    <div className="view-report-viewer">
      {menu}
      <nav className="pure-menu">
        <Header />
        <p>Print, save for later, or start new.</p>
        <ul className="pure-menu-list">
          <li className="pure-menu-item pure-menu-link" onClick={onPrevious}>
            <img src={back} alt="Previous" /> Previous
        </li>
          <li className="pure-menu-item pure-menu-link" onClick={onStartOver}>
            <img src={startOver} alt="Start Over" /> Start Over
        </li>
          <li className="pure-menu-item pure-menu-link" onClick={onPrint}>
            <img src={print} alt="Print" /> Print
        </li>
          <li className="pure-menu-item pure-menu-link" onClick={onSave}>
            <img src={save} alt="Save" /> Save
        </li >
        </ul >
      </nav >
      <main>
        <Room room={room} editable={false} />
      </main>
    </div >
  );
};

export default ReportViewer;
