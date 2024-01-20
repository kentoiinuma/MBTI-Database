// frontend/src/components/Header.jsx
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
    <header className="flex justify-between items-center p-4 bg-white text-black border-b border-[#2EA9DF]">
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
            {/* Notifications button */}
            <button onClick={() => navigate('/notifications')} className="p-2 rounded-full hover:bg-gray-100">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
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
