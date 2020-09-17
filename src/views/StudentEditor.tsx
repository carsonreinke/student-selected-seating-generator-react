import React, { ReactNode, useEffect } from 'react';
import Header from '../components/Header';
import { selectIsEmpty, selectCurrentRoom } from '../app/rootSlice';
import { useSelector, useDispatch } from 'react-redux';
import startOver from '../assets/images/start-over.svg';
import forward from '../assets/images/forward.svg';
import back from '../assets/images/back.svg';
import Student from '../components/Student';
import { toArray } from '../utils/collection';
import { addStudentPreference, removeStudentPreference, editStudentName, arrange } from '../app/roomSlice';

interface StudentEditorProps {
  menu: ReactNode;
  redirect: (path: string) => void;
}

export const StudentEditor = ({
  menu,
  redirect
}: StudentEditorProps) => {
  const dispatch = useDispatch();
  const isEmpty = useSelector(selectIsEmpty),
    room = useSelector(selectCurrentRoom);

  // Redirect back if we have nothing in room
  useEffect(() => {
    if (isEmpty) {
      onStartOver();
    }
  });

  // Internal handlers
  const onStartOver = () => redirect('/');
  const onNext = () => {
    dispatch(arrange());
    redirect('/report');
  };
  const onPrevious = () => redirect('/desks');

  const onEditName = (id: string, name: string) => {
    dispatch(editStudentName({ id, name }));
  };
  const onAddPreference = (id: string, preference: string) => {
    dispatch(addStudentPreference({ id, preference }));
  };
  const onRemovePreference = (id: string, preference: string) => {
    dispatch(removeStudentPreference({ id, preference }));
  };

  return (
    <div className="view-student-editor">
      {menu}
      <nav className="pure-menu">
        <Header />
        <p>Provide the name of each student and their preferences.</p>
        <ul className="pure-menu-list">
          <li className="pure-menu-item pure-menu-link" onClick={onNext}>
            <img src={forward} alt="Next" /> Next
        </li>
          <li className="pure-menu-item pure-menu-link" onClick={onPrevious}>
            <img src={back} alt="Previous" /> Previous
        </li>
          <li className="pure-menu-item pure-menu-link" onClick={onStartOver}>
            <img src={startOver} alt="Start Over" /> Start Over
        </li>
        </ul >
      </nav >
      <main>
        <h2>Students</h2>
        {toArray(room.students).map(student => {
          return (
            <Student key={student.id} student={student} students={room.students} addPreference={onAddPreference} editName={onEditName} removePreference={onRemovePreference} />
          );
        })}
      </main>
    </div >
  );
};

export default StudentEditor;
