import React from 'react';
import { Link } from 'react-router-dom';
import PageContent from './PageContent';
import './Sidebar.css'
import { Sidebar as ProSidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';

interface SidebarProps {
  pageName: string;
}

const Sidebar: React.FC<SidebarProps> = ({ pageName }) => {
  const pageNames = [pageName]; // Replace with your actual wiki pages

  return (
    <div className="sidebar">
      <h2>Your Wiki Pages</h2>
      <div>
        {pageNames.map(page => (
          <div key={page}>
            <ProSidebar>
              <Menu>
                <Link to={`/wiki/wikis/${page}`}> <MenuItem> {pageName} </MenuItem> </Link>
                <MenuItem> Page 2 </MenuItem>
                <Link to="/wikicreate"> <MenuItem> Create New Wiki Page </MenuItem> </Link>
              </Menu>
            </ProSidebar>
          </div>
        ))}
      </div>
      <PageContent />
    </div>
  );
};

export default Sidebar;
