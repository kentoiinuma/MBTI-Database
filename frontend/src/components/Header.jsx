// frontend/src/components/Header.jsx
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types'; // PropTypesをインポート
import { useUser, SignInButton, useClerk } from '@clerk/clerk-react'; // Clerkからユーザー関連のフックとコンポーネントをインポート
import { Link, useNavigate, useLocation } from 'react-router-dom'; // ルーティング用のコンポーネントをインポート
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined'; // ログインアイコン
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined'; // ヘルプアイコン
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'; // 情報アイコン
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'; // ログアウトアイコン
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'; // アカウントアイコン
import Menu from '@mui/material/Menu'; // メニューコンポーネント
import MenuItem from '@mui/material/MenuItem'; // メニューアイテムコンポーネント
import { useUserContext } from '../contexts/UserContext'; // UserContextをインポート
import { usePostUsername } from './PostDetail'; // usePostUsernameカスタムフックをインポート

// Headerコンポーネントの定義
const Header = ({ onSignIn }) => {
  const { isSignedIn, user } = useUser(); // ユーザーのサインイン状態と情報を取得
  const navigate = useNavigate(); // ナビゲーションフック
  const { signOut } = useClerk(); // サインアウト関数を取得
  const [anchorEl, setAnchorEl] = useState(null); // メニューのアンカー要素の状態
  const open = Boolean(anchorEl); // メニューが開いているかどうかの状態
  const location = useLocation(); // 現在のパスを取得
  const [userProfile, setUserProfile] = useState(null); // ユーザープロファイルの状態
  const { userUpdated, setUserUpdated } = useUserContext(); // UserContextから状態を取得
  const { postUsername } = usePostUsername(); // usePostUsernameを使用してコンテキストからユーザー名を取得

  // APIのURLを設定
  let API_URL;
  if (window.location.origin === 'http://localhost:3001') {
    API_URL = 'http://localhost:3000';
  } else if (window.location.origin === 'https://www.mbti-database.com') {
    API_URL = 'https://api.mbti-database.com';
  } else {
    // デフォルトのURL
    API_URL = 'http://localhost:3000';
  }

  useEffect(() => {
    const clerkId = user?.id;
    if (clerkId) {
      // userUpdatedがtrueの場合にのみフェッチを実行
      fetch(`${API_URL}/api/v1/users/${clerkId}`)
        .then((response) => response.json())
        .then((data) => {
          setUserProfile({
            username: data.username,
            avatarUrl: data.avatar_url,
          });
          setUserUpdated(false); // フェッチ後に状態をリセット
        });
    }
  }, [API_URL, user, userUpdated]); // userUpdatedとsetUserUpdatedを依存配列に追加

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

  // テキストを小さく表示するための関数
  const smallText = (text) => <span style={{ fontSize: '18px' }}>{text}</span>;

  // 現在のパスに応じたタイトルを取得する関数
  const getTitle = () => {
    const path = location.pathname;
    const postIdMatch = path.match(/\/post\/(\d+)/);
    if (postIdMatch && postUsername) {
      // コンテキストから取得したユーザー名を使用
      return `${postUsername}のポスト`;
    }
    // その他のパスに対する既存のタイトルロジック...
    switch (path) {
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
        return 'MBTIデータベースとは？';
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
              className="p-2 rounded-full hover:bg-gray-200"
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
            {/* ユーザーアバター */}
            <div>
              <button
                aria-controls="basic-menu"
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
              >
                <img
                  src={userProfile?.avatarUrl}
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
                PaperProps={{
                  style: {
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.25)', // 影のスタイルを薄く調整
                  },
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
                  {userProfile ? userProfile.username : 'Loading...'}
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
        <div className="ml-auto flex items-center gap-2">
          <Link
            to="/about"
            className={
              location.pathname === '/about'
                ? 'sidebar-link active'
                : 'sidebar-link'
            }
            style={{ fontSize: '20px', color: '#2EA9DF' }}
          >
            このアプリについて
          </Link>
          <div className="p-2 rounded-full hover:bg-gray-200">
            <SignInButton>
              <LoginOutlinedIcon style={{ fontSize: '32px' }} />
            </SignInButton>
          </div>
        </div>
      )}
    </header>
  );
};

Header.propTypes = {
  onSignIn: PropTypes.func, // onSignInの型チェックを追加
};

export default Header;
