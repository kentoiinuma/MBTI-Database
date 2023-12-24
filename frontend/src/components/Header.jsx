import React, { useEffect } from 'react';
import { useUser, SignInButton, UserButton } from '@clerk/clerk-react';

const Header = ({ onSignIn }) => {
  const { isSignedIn, user } = useUser();

  useEffect(() => {
    if (isSignedIn) {
      onSignIn();
    }
  }, [isSignedIn, onSignIn]);

  return (
    <header className="flex justify-between items-center p-4 bg-white text-black border-b border-[#7DB9DE]">
      {isSignedIn ? (
        <>
          <span className="text-xl font-semibold">{user?.firstName}</span>
          <div className="flex items-center">
            {/* ここでClerkのUserButtonコンポーネントを使用 */}
            <UserButton />
          </div>
        </>
      ) : (
        <div className="ml-auto">
          {/* サインインが必要な場合に表示するSignInButton */}
          <SignInButton>SignIn</SignInButton>
        </div>
      )}
    </header>
  );
};

export default Header;

