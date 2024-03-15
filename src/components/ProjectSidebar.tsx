import React from 'react';
import { Link } from './Types';

interface SidebarProps {
  links: Link[];
  onSelect: (url: string) => void;
}

const ProjectSidebar: React.FC<SidebarProps> = ({ links, onSelect }) => {
  return (
    <div className="sidebar">
      <ul>
        {links.map(link => (
          <li key={link.url}>
            <button onClick={() => onSelect(link.url)}>{link.name}</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectSidebar;
