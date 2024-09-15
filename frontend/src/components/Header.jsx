import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types'; // PropTypesをインポート
import { useUser, SignInButton, useClerk } from '@clerk/clerk-react'; // Clerkからユーザー関連のフックとコンポーネントをインポート
import { Link, useNavigate, NavLink, useLocation } from 'react-router-dom'; // ルーティング用のコンポーネントをインポート
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined'; // ヘルプアイコン
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'; // ログアウトアイコン
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'; // アカウントアイコン
import Menu from '@mui/material/Menu'; // メニューコンポーネント
import MenuItem from '@mui/material/MenuItem'; // メニューアイテムコンポーネント
import { useUserContext } from '../contexts/UserContext'; // UserContextをインポート
import GavelOutlinedIcon from '@mui/icons-material/GavelOutlined'; // 利用規約アイコン
import PolicyOutlinedIcon from '@mui/icons-material/PolicyOutlined'; // プライバシーポリシーアイコン
import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined'; // お問い合わせアイコンを追加
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined'; // ログインアイコンを追加

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

  const getTitle = () => {
    return (
      <div className="flex items-center">
        <h1 className="text-xl font-bold flex items-center">
          <img
            src={process.env.PUBLIC_URL + '/favicon.ico'}
            alt="favicon"
            className="w-8 h-8 mr-2"
          />
          <NavLink to="/" className="font-semibold italic">
            <span className="text-[#7B90D2] text-[1.4em]">M</span>
            <span className="text-[#86C166] text-[1.4em]">B</span>
            <span className="text-[#A5DEE4] text-[1.4em]">T</span>
            <span className="text-[#FBE251] text-[1.4em]">I</span>
            <span className="text-[#2EA9DF] text-[1.2em]">データベース</span>
          </NavLink>
        </h1>
        <p className="text-sm ml-4 text-[#2EA9DF] hidden md:block">
          MBTIタイプに紐づけて好きを共有するアプリ
        </p>
      </div>
    );
  };

  // ヘッダーコンポーネントのレンダリング
  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 flex justify-between items-center px-4 py-2 bg-off-white text-black z-10 ${
          location.pathname !== '/' ? 'border-b' : ''
        }`}
      >
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
                    className="h-11 w-11 object-cover rounded-full hover:brightness-90"
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
                    className: 'shadow-md',
                  }}
                >
                  {/* プロフィールメニューアテム */}
                  <MenuItem
                    onClick={handleClose}
                    component={Link}
                    to="/profile"
                    className="flex items-center"
                  >
                    <AccountCircleOutlinedIcon className="text-xl mr-2" />
                    {userProfile ? userProfile.username : 'Loading...'}
                  </MenuItem>
                  {/* アプリ情報メニューアイテム */}
                  <MenuItem
                    onClick={handleClose}
                    component={Link}
                    to="/about"
                    className="flex items-center"
                  >
                    <HelpOutlineOutlinedIcon className="text-xl mr-2" />
                    使い方
                  </MenuItem>
                  {/* お問合わせメニューアイテム */}
                  <MenuItem
                    onClick={handleClose}
                    component={'a'} // Linkからaに変更
                    href="https://docs.google.com/forms/d/e/1FAIpQLSeuIOHxpmTYuldKbl9mbiAGMy6DI4bvoT7_SfeO18jCNqPIhA/viewform?usp=sf_link" // Google FormsのURLを指定
                    target="_blank" // 別タブで開く
                    rel="noopener noreferrer" // セキュリティ対策
                    className="flex items-center"
                  >
                    <QuestionAnswerOutlinedIcon className="text-xl mr-2" />
                    お問い合わせ
                  </MenuItem>
                  {/* 利用規約メニューアイテム */}
                  <MenuItem
                    onClick={handleClose}
                    component={Link}
                    to="/terms-of-service"
                    className="flex items-center"
                  >
                    <GavelOutlinedIcon className="text-xl mr-2" />
                    利用規約
                  </MenuItem>
                  {/* プライバシーポリシーメニューアイテム */}
                  <MenuItem
                    onClick={handleClose}
                    component={Link}
                    to="/privacy-policy"
                    className="flex items-center"
                  >
                    <PolicyOutlinedIcon className="text-xl mr-2" />
                    プライバシーポリシー
                  </MenuItem>
                  {/* サインアウトメニューアイテム */}
                  <MenuItem
                    onClick={() => {
                      handleSignOut();
                      handleClose();
                    }}
                  >
                    <LogoutOutlinedIcon className="text-xl mr-2" />
                    サインアウト
                  </MenuItem>
                </Menu>
              </div>
            </div>
          </>
        ) : (
          <div className="ml-auto flex flex-col md:flex-row items-center">
            <SignInButton>
              <span
                className={`text-xl text-[#2EA9DF] ${location.pathname === '/signin' ? 'sidebar-link active' : 'sidebar-link'} flex items-center`}
              >
                <LoginOutlinedIcon /> {/* ログインアイコンを追加 */}
                ログイン
              </span>
            </SignInButton>
          </div>
        )}
      </header>
      <div className="h-12"></div> {/* ヘッダーの高さ分のスペーサー */}
    </>
  );
};

Header.propTypes = {
  onSignIn: PropTypes.func, // onSignInの型チェックを追加
};

export default Header;
