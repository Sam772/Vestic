import React, { useState } from 'react';

interface Link {
  name: string;
  url: string;
}

const Sidebar: React.FC<{ links: Link[], onSelect: (url: string) => void }> = ({ links, onSelect }) => {
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

const ProjectCreation: React.FC = () => {
  
  const [selectedLink, setSelectedLink] = useState<string>('');
  
  const links: Link[] = [
    { name: 'Workspace1', url: '/workspace1' },
    { name: 'Workspace2', url: '/workspace2' },
    { name: 'Workspace3', url: '/workspace3' }
  ];

  const handleLinkSelect = (url: string) => {
    setSelectedLink(url);
  };

  return (
    <div className="project-creation-page">
      <div>
        <h1>Project Creation Page</h1>
      </div>
      <Sidebar links={links} onSelect={handleLinkSelect} />
      <div className="content">
        <h1>Selected Link: {selectedLink}</h1>
      </div>
    </div>
    );

};

export default ProjectCreation;
