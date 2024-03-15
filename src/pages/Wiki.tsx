import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
    <div>
      <h1>Wiki Page</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="pageName">Enter Page Name:</label>
        <input
          type="text"
          id="pageName"
          value={pageName}
          onChange={handleChange}
          required
        />
        <button type="submit">Post</button>
      </form>
    </div>
  );
};

export default Wiki;
