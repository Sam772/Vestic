import React from 'react';
import { Link } from 'react-router-dom';
import PageContent from './PageContent';
import './Sidebar.css'

interface SidebarProps {
  pageName: string;
}

const Sidebar: React.FC<SidebarProps> = ({ pageName }) => {
  const pageNames = [pageName, 'Page 2', 'Page 3']; // Replace with your actual wiki pages

  return (
    <div className="sidebar">
      <h2>Wiki Pages</h2>
      <div>
        {pageNames.map(page => (
          <div key={page}>
            <Link to={`/wiki/wikis/${page}`}>
              <button className='sidebar-button'>{page}</button>
            </Link>
          </div>
        ))}
      </div>
      <div>
        <Link to="/wikicreate">
          <button className='sidebar-button'>Create New Wiki Page</button>
        </Link>
      </div>
      <p>Current Page: {pageName}</p>
      <PageContent />
    </div>
  );
};

export default Sidebar;
