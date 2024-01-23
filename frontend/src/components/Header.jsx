// frontend/src/components/Header.jsx
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import { useUser, SignInButton, useClerk } from '@clerk/clerk-react';
import { Link, useNavigate } from 'react-router-dom';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

const Header = ({ onSignIn }) => {
  const { isSignedIn, user } = useUser();
  const navigate = useNavigate();
  const { signOut } = useClerk();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (isSignedIn && user) {
      onSignIn();
    }
  }, [isSignedIn, onSignIn, user]);

  const smallText = (text) => <span style={{ fontSize: '18px' }}>{text}</span>;

  const getTitle = () => {
    switch (window.location.pathname) {
      case '/profile':
        return 'プロフィール';
      case '/post':
        return 'ポスト';
      case '/':
        return 'ホーム';
      case '/Se':
        return <>Se {smallText('ESFP/ESTP/ISFP/ISTP')} のデータベース</>;
      case '/Si':
        return <>Si {smallText('ESFJ/ESTJ/ISFJ/ISTJ')} のデータベース</>;
      case '/Ne':
        return <>Ne {smallText('ENFP/ENTP/INFP/INTP')} のデータベース</>;
      case '/Ni':
        return <>Ni {smallText('ENFJ/ENTJ/INFJ/INTJ')} のデータベース</>;
      case '/notifications':
        return '通知';
      case '/terms-of-service':
        return '利用規約';
      case '/privacy-policy':
        return 'プライバシーポリシー';
      case '/about':
        return '16type Favorite Databaseについて';
      case '/contact':
        return 'お問い合わせ';
      default:
        return '';
    }
  };

  return (
    <header className="flex justify-between items-center px-4 py-2 bg-white text-black border-b border-[#7DB9DE]">
      <span className="ml-72" style={{ fontSize: '24px' }}>
        {getTitle()}
      </span>
      {isSignedIn ? (
        <>
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
            <div>
              <button
                aria-controls="basic-menu"
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
              >
                <img
                  src={user?.profileImageUrl}
                  alt="User avatar"
                  className="h-11 w-11 object-cover rounded-full"
                />
              </button>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                }}
              >
                <MenuItem
                  onClick={handleClose}
                  component={Link}
                  to="/profile"
                  className="flex items-center"
                >
                  <AccountCircleOutlinedIcon
                    style={{ fontSize: '20px', marginRight: '8px' }}
                  />
                  {user.username}
                </MenuItem>
                <MenuItem
                  onClick={handleClose}
                  component={Link}
                  to="/about" // Updated link
                  className="flex items-center"
                >
                  <InfoOutlinedIcon
                    style={{ fontSize: '20px', marginRight: '8px' }}
                  />
                  16type Favorite Databaseについて
                </MenuItem>
                <MenuItem
                  onClick={handleClose}
                  component={Link}
                  to="/contact" // Updated link
                  className="flex items-center"
                >
                  <HelpOutlineOutlinedIcon
                    style={{ fontSize: '20px', marginRight: '8px' }}
                  />
                  お問い合わせ
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleSignOut();
                    handleClose();
                  }}
                >
                  <LogoutOutlinedIcon
                    style={{ fontSize: '20px', marginRight: '8px' }}
                  />
                  サインアウト
                </MenuItem>
              </Menu>
            </div>
          </div>
        </>
      ) : (
        <span className="ml-auto">
          <Link to="/about">
            <InfoOutlinedIcon
              style={{ fontSize: '32px', marginRight: '8px' }}
            />
          </Link>
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
