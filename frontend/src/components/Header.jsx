import React from 'react';
import { useUser, SignInButton, SignUpButton, SignOutButton } from '@clerk/clerk-react';

const Header = () => {
  const { isSignedIn, user } = useUser();

  return (
    <header className="flex justify-between items-center p-4 bg-white text-black border-b border-[#7DB9DE]">
      {isSignedIn ? (
        <>
          <span className="text-xl font-semibold">{user?.firstName}</span>
          <div className="flex items-center">
            <SignOutButton>SignOut</SignOutButton>
          </div>
        </>
      ) : (
        <div className="ml-auto">
          <button className="btn btn-primary mr-4">?</button>
          <SignInButton style={{ marginRight: '10px' }}>SignIn</SignInButton>
          <SignUpButton>SignUp</SignUpButton>
        </div>
      )}
    </header>
  );
};

export default Header;
