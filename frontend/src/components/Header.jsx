// Header.jsx
import React from 'react';

const Header = () => {
  return (
    <header className="bg-white text-black p-4 flex justify-between items-center border-b border-[#7DB9DE]">
      <h1>16type Favorite Database</h1>
      <div>
        <button className="btn btn-primary">?</button>
        <button className="btn btn-primary">⇒</button>
      </div>
    </header>
  );
};

export default Header;
