// frontend/src/components/Header.jsx
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types'; // PropTypesをインポート
import { useUser, SignInButton, useClerk } from '@clerk/clerk-react'; // Clerkからユーザー関連のフックとコンポーネントをインポート
import { Link, useNavigate } from 'react-router-dom'; // ルーティング用のコンポーネントをインポート
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined'; // ログインアイコン
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined'; // ヘルプアイコン
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'; // 情報アイコン
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'; // ログアウトアイコン
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'; // アカウントアイコン
import Menu from '@mui/material/Menu'; // メニューコンポーネント
import MenuItem from '@mui/material/MenuItem'; // メニューアイテムコンポーネント

// Headerコンポーネントの定義
const Header = ({ onSignIn }) => {
  const { isSignedIn, user } = useUser(); // ユーザーのサインイン状態と情報を取得
  const navigate = useNavigate(); // ナビゲーションフック
  const { signOut } = useClerk(); // サインアウト関数を取得
  const [anchorEl, setAnchorEl] = useState(null); // メニューのアンカー要素の状態
  const open = Boolean(anchorEl); // メニューが開いているかどうかの状態

  // サインアウト処理
  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  // メニューを開く処理
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // メニューを閉じる処理
  const handleClose = () => {
    setAnchorEl(null);
  };

  // サインイン状態が変わった時の処理
  useEffect(() => {
    if (isSignedIn && user) {
      onSignIn();
    }
  }, [isSignedIn, onSignIn, user]);

  // テキストを小さく表示するための関数
  const smallText = (text) => <span style={{ fontSize: '18px' }}>{text}</span>;

  // 現在のパスに応じたタイトルを取得する関数
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
        return '16type Favorite Databaseとは？';
      case '/contact':
        return 'お問い合わせ';
      default:
        return '';
    }
  };

  // ヘッダーコンポーネントのレンダリング
  return (
    <header className="flex justify-between items-center px-4 py-2 bg-white text-black border-b border-[#2EA9DF]">
      {/* タイトル表示 */}
      <span className="ml-72" style={{ fontSize: '24px' }}>
        {getTitle()}
      </span>
      {isSignedIn ? (
        <>
          <div className="flex items-center gap-4">
            {/* 投稿アイコンボタン */}
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
            {/* 通知アイコンボタン */}
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
            {/* ユーザーアバター */}
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
              {/* ユーザーメニュー */}
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                }}
              >
                {/* プロフィールメニューアイテム */}
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
                {/* アプリ情報メニューアイテム */}
                <MenuItem
                  onClick={handleClose}
                  component={Link}
                  to="/about" // Updated link
                  className="flex items-center"
                >
                  <InfoOutlinedIcon
                    style={{ fontSize: '20px', marginRight: '8px' }}
                  />
                  このアプリについて
                </MenuItem>
                {/* お問い合わせメニューアイテム */}
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
                {/* サインアウトメニューアイテム */}
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
          <Link
            to="/about"
            style={{ fontSize: '20px', marginRight: '10px', color: '#2EA9DF' }}
          >
            このアプリについて
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
  onSignIn: PropTypes.func, // onSignInの型チェックを追加
};

export default Header;
