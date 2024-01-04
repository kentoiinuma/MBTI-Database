import React, { useEffect, useState } from 'react';
import { useUser, SignInButton } from '@clerk/clerk-react';
import CustomDropdownMenu from './CustomDropdownMenu'; // Your custom dropdown menu

const Header = ({ onSignIn }) => {
  const { isSignedIn, user } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (isSignedIn && user) {
      onSignIn();
    }
  }, [isSignedIn, onSignIn, user]);

  return (
    <header className="flex justify-between items-center p-4 bg-white text-black border-b border-[#7DB9DE]">
      {isSignedIn ? (
        <>
          <span ></span>
          <div className="flex items-center gap-4">
            {/* Upload icon button */}
            <button className="p-2 rounded-full hover:bg-gray-100">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </button>
            {/* Bell icon button */}
            <button className="p-2 rounded-full hover:bg-gray-100">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
              </svg>
            </button>
            {/* User avatar */}
            <div onClick={handleClick} className="flex items-center">
              <img src={user?.profileImageUrl} alt="User avatar" className="h-10 w-10 object-cover rounded-full" />
              <CustomDropdownMenu isOpen={isOpen} setIsOpen={setIsOpen} />
            </div>
          </div>
        </>
      ) : (
        <div className="ml-auto">
          <SignInButton>SignIn</SignInButton>
        </div>
      )}
    </header>
  );
};

export default Header;


