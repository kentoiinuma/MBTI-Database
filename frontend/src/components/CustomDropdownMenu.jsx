import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SignOutButton } from '@clerk/clerk-react';

const CustomDropdownMenu = ({ isOpen, setIsOpen }) => {
  const ref = useRef(null);

  // Detect clicks outside the menu to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, setIsOpen]);

  return (
    <div className="relative" ref={ref}>
      {/* Place an icon or button */}
      <button onClick={() => setIsOpen(!isOpen)} className="p-2">
        {/* Placeholder for profile icon */}
      </button>

      {/* Contents of the dropdown menu */}
      {isOpen && (
        <div className="absolute right-0 w-48 py-2 mt-2 bg-white rounded-md shadow-xl">
          <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">プロフィール</Link>
          <Link to="/how-to" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">使い方</Link>
          <Link to="/contact" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">お問い合わせ</Link>
          <SignOutButton className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">サインアウト</SignOutButton>
        </div>
      )}
    </div>
  );
};

export default CustomDropdownMenu;
