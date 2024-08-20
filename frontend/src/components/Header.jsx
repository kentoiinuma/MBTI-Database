// frontend/src/components/Header.jsx
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types'; // PropTypesをインポート
import { useUser, SignInButton, useClerk } from '@clerk/clerk-react'; // Clerkからユーザー関連のフックとコンポーネントをインポート
import { Link, useNavigate, NavLink, useLocation } from 'react-router-dom'; // ルーティング用のコンポーネントをインポート
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined'; // ログインアイコン
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined'; // ヘルプアイコン
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'; // 情報アイコン
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'; // ログアウトアイコン
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'; // アカウントアイコン
import Menu from '@mui/material/Menu'; // メニューコンポーネント
import MenuItem from '@mui/material/MenuItem'; // メニューアイテムコンポーネント
import { useUserContext } from '../contexts/UserContext'; // UserContextをインポート
import GavelOutlinedIcon from '@mui/icons-material/GavelOutlined'; // 利用規約アイコン
import PolicyOutlinedIcon from '@mui/icons-material/PolicyOutlined'; // プライバシーポリシーアイコン
import StorageIcon from '@mui/icons-material/Storage'; // データベースアイコン
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'; // ホームアイコンをインポート

// Headerコンポーネントの定義
const Header = ({ onSignIn }) => {
  const { isSignedIn, user } = useUser(); // ユーザーのサインイン状態と情報を取得
  const navigate = useNavigate(); // ナビゲーションフック
  const { signOut } = useClerk(); // サインアウト関数を取得
  const [anchorEl, setAnchorEl] = useState(null); // メニューのアンカー要素の状態
  const open = Boolean(anchorEl); // メニューが開いているかどうかの状態
  const [userProfile, setUserProfile] = useState(null); // ユーザープロファイルの状態
  const { userUpdated, setUserUpdated } = useUserContext(); // UserContextから状態を取得
  const location = useLocation(); // useLocationフックを使用して現在のlocationを取得

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
  }, [API_URL, user, userUpdated, setUserUpdated]); // userUpdatedとsetUserUpdatedを依存配列に追加

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

  // 現在のパスに応じたタイトルを取得する関数
  const getTitle = () => {
    return (
      <div className="flex items-center">
        <h1 className="text-xl font-bold mr-4 flex items-center">
          <img
            src={process.env.PUBLIC_URL + '/favicon.ico'}
            alt="favicon"
            className="w-8 h-8 mr-2"
          />
          <NavLink
            to="/"
            style={{
              fontWeight: '600',
              fontStyle: 'italic',
            }}
          >
            <span style={{ color: '#7B90D2', fontSize: '1.4em' }}>M</span>
            <span style={{ color: '#86C166', fontSize: '1.4em' }}>B</span>
            <span style={{ color: '#A5DEE4', fontSize: '1.4em' }}>T</span>
            <span style={{ color: '#FBE251', fontSize: '1.4em' }}>I</span>
            <span style={{ color: '#2EA9DF', fontSize: '1.2em' }}>データベース</span>
          </NavLink>
        </h1>
      </div>
    );
  };

  // ヘッダーコンポーネントのレンダリング
  return (
    <header className="flex justify-between items-center px-4 py-2 bg-white text-black">
      {getTitle()}
      {isSignedIn ? (
        <>
          <div className="flex items-center gap-4">
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
                  <AccountCircleOutlinedIcon style={{ fontSize: '20px', marginRight: '8px' }} />
                  {userProfile ? userProfile.username : 'Loading...'}
                </MenuItem>
                {/* アプリ情報メニューアイテム */}
                <MenuItem
                  onClick={handleClose}
                  component={Link}
                  to="/about"
                  className="flex items-center"
                >
                  <InfoOutlinedIcon style={{ fontSize: '20px', marginRight: '8px' }} />
                  このアプリについて
                </MenuItem>
                {/* お問い合わせメニューアイテム */}
                <MenuItem
                  onClick={handleClose}
                  component={Link}
                  to="/contact"
                  className="flex items-center"
                >
                  <HelpOutlineOutlinedIcon style={{ fontSize: '20px', marginRight: '8px' }} />
                  お問い合わせ
                </MenuItem>
                {/* 利用規約メニューアイテム */}
                <MenuItem
                  onClick={handleClose}
                  component={Link}
                  to="/terms-of-service"
                  className="flex items-center"
                >
                  <GavelOutlinedIcon style={{ fontSize: '20px', marginRight: '8px' }} />
                  利用規約
                </MenuItem>
                {/* プライバシーポリシーメニューアイテム */}
                <MenuItem
                  onClick={handleClose}
                  component={Link}
                  to="/privacy-policy"
                  className="flex items-center"
                >
                  <PolicyOutlinedIcon style={{ fontSize: '20px', marginRight: '8px' }} />
                  プライバシーポリシー
                </MenuItem>
                {/* ホームメニューアイテム */}
                <MenuItem
                  onClick={handleClose}
                  component={NavLink}
                  to="/"
                  className="flex items-center"
                >
                  <HomeOutlinedIcon style={{ fontSize: '20px', marginRight: '8px' }} />
                  ホーム
                </MenuItem>
                {/* データベースメニューアイテム */}
                <MenuItem
                  onClick={handleClose}
                  component={Link}
                  to="/database"
                  className="flex items-center"
                >
                  <StorageIcon style={{ fontSize: '20px', marginRight: '8px' }} />
                  データベース
                </MenuItem>
                {/* サインアウトメニューアイテム */}
                <MenuItem
                  onClick={() => {
                    handleSignOut();
                    handleClose();
                  }}
                >
                  <LogoutOutlinedIcon style={{ fontSize: '20px', marginRight: '8px' }} />
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
            className={location.pathname === '/about' ? 'sidebar-link active' : 'sidebar-link'}
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
