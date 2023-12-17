// Header.jsx
import React from 'react';

const Header = () => {
  return (
    <header className="flex justify-between items-center p-4 bg-white text-black border-b border-[#7DB9DE]">
      <div></div>
      <div>
        <button className="btn btn-primary">?</button>
        <button className="btn btn-primary">⇒</button>
      </div>
    </header>
  );
};

export default Header;