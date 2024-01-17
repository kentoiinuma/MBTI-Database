import React, { useEffect } from 'react';
import { useUser, SignInButton, useClerk } from '@clerk/clerk-react';
import { Link, useNavigate } from 'react-router-dom';

const Header = ({ onSignIn }) => {
  const { isSignedIn, user } = useUser();
  const navigate = useNavigate();
  const { signOut } = useClerk();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
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
            <button className="p-2 rounded-full hover:bg-gray-100" onClick={() => navigate('/post')}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </button>
            {/* User avatar */}
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" ><img src={user?.profileImageUrl} alt="User avatar" className="h-10 w-10 object-cover rounded-full" /></div>
              <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                <li><Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">プロフィール</Link></li>
                <li><Link to="/how-to" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">使い方</Link></li>
                <li><Link to="/contact" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">お問い合わせ</Link></li>
                <li><button onClick={handleSignOut} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">サインアウト</button></li>
              </ul>
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
