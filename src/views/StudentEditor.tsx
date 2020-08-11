import React, { ReactNode } from 'react';
import Header from '../components/Header';

interface StudentEditorProps {
  menu: ReactNode;
}

export const StudentEditor = ({ menu }: StudentEditorProps) => {
  return (
    <div className="view-student-editor">
      {menu}
      <nav className="pure-menu">
        <Header />
      </nav>
      <main>
        Students TODO
      </main>
    </div>
  );
};

export default StudentEditor;
