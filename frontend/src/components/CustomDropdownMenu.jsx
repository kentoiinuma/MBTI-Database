import React, { useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useClerk } from '@clerk/clerk-react';

const CustomDropdownMenu = ({ isOpen, setIsOpen }) => {
  const ref = useRef(null);
  const navigate = useNavigate();
  const { signOut } = useClerk();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

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
          <button onClick={handleSignOut} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">サインアウト</button>
        </div>
      )}
    </div>
  );
};

export default CustomDropdownMenu;
