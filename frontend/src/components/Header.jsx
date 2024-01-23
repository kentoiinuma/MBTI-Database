// frontend/src/components/Header.jsx
import React, { useEffect } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import { useUser, SignInButton, useClerk } from '@clerk/clerk-react';
import { Link, useNavigate } from 'react-router-dom';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';

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
    <header className="flex justify-between items-center px-4 py-2 bg-white text-black border-b border-[#7DB9DE]">
      {isSignedIn ? (
        <>
          <span></span>
          <div className="flex items-center gap-4">
            {/* Upload icon button */}
            <button
              className="p-2 rounded-full hover:bg-gray-100"
              onClick={() => navigate('/post')}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.0}
                stroke="#2EA9DF"
                className="w-11 h-11"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
            </button>
            {/* Notifications button */}
            <button
              onClick={() => navigate('/notifications')}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-7 h-7"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                />
              </svg>
            </button>
            {/* User avatar */}
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button">
                <img
                  src={user?.profileImageUrl}
                  alt="User avatar"
                  className="h-11 w-11 object-cover rounded-full"
                />
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <AccountCircleOutlinedIcon
                      style={{
                        fontSize: '20px',
                        marginRight: '8px',
                      }}
                    />
                    {user.username}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/how-to"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <InfoOutlinedIcon
                      style={{
                        fontSize: '20px',
                        marginRight: '8px',
                      }}
                    />
                    このアプリについて
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <HelpOutlineOutlinedIcon
                      style={{
                        fontSize: '20px',
                        marginRight: '8px',
                      }}
                    />
                    お問い合わせ
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleSignOut}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogoutOutlinedIcon
                      style={{
                        fontSize: '20px',
                        marginRight: '8px',
                      }}
                    />
                    サインアウト
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </>
      ) : (
        <span className="ml-auto">
          <InfoOutlinedIcon
            style={{
              fontSize: '32px',
              marginRight: '8px',
            }}
          />
          <SignInButton>
            <LoginOutlinedIcon style={{ fontSize: '32px' }} />
          </SignInButton>
        </span>
      )}
    </header>
  );
};

Header.propTypes = {
  onSignIn: PropTypes.func, // Add type checking for onSignIn
};

export default Header;
