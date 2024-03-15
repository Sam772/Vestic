import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Wiki.css';

interface WikiProps {
  createWikiPage: (pageName: string) => void;
}

const Wiki: React.FC<WikiProps> = ({ createWikiPage }) => {
  const [pageName, setPageName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createWikiPage(pageName);
    navigate(`/wiki/${pageName}`);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPageName(event.target.value);
  };

  return (
    <div className="wiki-container">
      <h1 className="wiki-heading">Wiki Page</h1>
      <form className="wiki-form" onSubmit={handleSubmit}>
        <label htmlFor="pageName" className="wiki-label">Enter Page Name:</label>
        <input
          type="text"
          id="pageName"
          value={pageName}
          onChange={handleChange}
          className="wiki-input"
          required
        />
        <button type="submit" className="wiki-button">Post</button>
      </form>
    </div>
  );
};

export default Wiki;
