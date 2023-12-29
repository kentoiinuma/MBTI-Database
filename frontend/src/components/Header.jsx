import React, { useEffect } from 'react';
import { useUser, SignInButton, UserButton } from '@clerk/clerk-react';

const Header = ({ onSignIn }) => {
  const { isSignedIn, user } = useUser();

  useEffect(() => {
    if (isSignedIn) {
      onSignIn(user.id);
    }
  }, [isSignedIn, onSignIn, user]);

  return (
    <header className="flex justify-between items-center p-4 bg-white text-black border-b border-[#7DB9DE]">
      {isSignedIn ? (
        <>
          <span className="text-xl font-semibold">{user?.firstName}</span>
          <div className="flex items-center">
            <UserButton />
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

