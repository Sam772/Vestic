import React from 'react';
import { useParams } from 'react-router-dom';
import PageContent from './PageContent';

interface SidebarProps {
  pageName: string;
}

const Sidebar: React.FC<SidebarProps> = ({ pageName }) => {
  const pageNames = ['Page 1', 'Page 2', 'Page 3'];

  return (
    <div>
      <div className="sidebar">
        <h2>Sidebar</h2>
        <ul>
          {pageNames.map(page => (
            <li key={page}>{page}</li>
          ))}
        </ul>
        <p>Current Page: {pageName}</p>
      </div>
      <PageContent />
    </div>
  );
};

export default Sidebar;
