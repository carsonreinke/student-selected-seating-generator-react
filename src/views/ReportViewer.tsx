import React, { ReactNode } from 'react';
import Header from '../components/Header';

interface ReportViewerProps {
  menu: ReactNode;
}

export const ReportViewer = ({ menu }: ReportViewerProps) => {
  return (
    <div className="view-report-viewer">
      {menu}
      <nav className="pure-menu">
        <Header />
      </nav>
      <main>
        Report TODO
      </main>
    </div>
  );
};

export default ReportViewer;
