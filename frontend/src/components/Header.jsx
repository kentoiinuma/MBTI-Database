import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useUser, SignInButton, useClerk } from '@clerk/clerk-react';
import { Link, useNavigate, NavLink, useLocation } from 'react-router-dom';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import GavelOutlinedIcon from '@mui/icons-material/GavelOutlined';
import PolicyOutlinedIcon from '@mui/icons-material/PolicyOutlined';
import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined';
import { useUserContext } from '../contexts/UserContext';
import { getApiUrl } from '../utils/apiUrl';

/**
 * ヘッダーコンポーネント
 * アプリケーションの上部に固定表示され、ナビゲーションやユーザー情報を提供
 */
const Header = () => {
  // ユーザー認証関連のステートと関数
  const { isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const [profile, setProfile] = useState(null);
  const { isProfileUpdated, setIsProfileUpdated } = useUserContext();

  /**
   * ユーザープロフィール情報をAPIから取得する関数
   */
  const fetchUserProfile = useCallback(
    async (clerkId) => {
      try {
        const profileRes = await fetch(`${getApiUrl()}/users/${clerkId}`);
        const profileData = await profileRes.json();
        setProfile({
          username: profileData.username,
          avatarUrl: profileData.avatar_url,
        });
        setIsProfileUpdated(false);
      } catch (error) {
        console.error('ユーザープロフィールの取得中にエラーが発生しました:', error);
      }
    },
    [setIsProfileUpdated]
  );

  // ユーザー情報が変更されたときにプロフィールを再取得
  useEffect(() => {
    const clerkId = user?.id;
    if (clerkId && (isProfileUpdated || profile === null)) {
      fetchUserProfile(clerkId);
    }
  }, [user, isProfileUpdated, profile, fetchUserProfile]);

  // サインアウト処理
  const handleSignOut = useCallback(async () => {
    await signOut();
    navigate('/');
  }, [signOut, navigate]);

  // メニュー操作の処理
  const handleMenuOpen = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  // タイトルとロゴのレンダリング（パフォーマンス最適化のためmemo化）
  const renderTitle = useMemo(
    () => (
      <div className="flex items-center">
        <h1 className="text-xl font-bold flex items-center">
          <img
            src={process.env.PUBLIC_URL + '/favicon.ico'}
            alt="favicon"
            className="w-8 h-8 mr-2"
          />
          <NavLink to="/posts" className="font-semibold italic">
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
    ),
    []
  );

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 flex justify-between items-center px-4 py-2 bg-off-white text-black z-20 ${
          location.pathname !== '/posts' ? 'border-b' : ''
        }`}
      >
        {renderTitle}

        {/* ログイン状態によって表示を切り替え */}
        {isSignedIn ? (
          <div className="flex items-center gap-4">
            {/* ユーザーアバターとドロップダウンメニュー */}
            <div>
              <button
                aria-controls="basic-menu"
                aria-haspopup="true"
                aria-expanded={isMenuOpen ? 'true' : undefined}
                onClick={handleMenuOpen}
              >
                <img
                  src={profile?.avatarUrl}
                  alt="User avatar"
                  className="h-11 w-11 object-cover rounded-full hover:brightness-90"
                />
              </button>

              {/* ドロップダウンメニュー内の各項目 */}
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={isMenuOpen}
                onClose={handleMenuClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                }}
                PaperProps={{
                  className: 'shadow-md',
                }}
              >
                {/* プロフィールへのリンク */}
                <MenuItem
                  onClick={handleMenuClose}
                  component={Link}
                  to="/users"
                  className="flex items-center"
                >
                  <AccountCircleOutlinedIcon className="text-xl mr-2" />
                  {profile ? profile.username : 'Loading...'}
                </MenuItem>

                {/* 各種リンク（使い方、問い合わせ、規約など） */}
                <MenuItem
                  onClick={handleMenuClose}
                  component={Link}
                  to="/"
                  className="flex items-center"
                >
                  <HelpOutlineOutlinedIcon className="text-xl mr-2" />
                  使い方
                </MenuItem>
                <MenuItem
                  onClick={handleMenuClose}
                  component="a"
                  href="https://docs.google.com/forms/d/e/1FAIpQLSeuIOHxpmTYuldKbl9mbiAGMy6DI4bvoT7_SfeO18jCNqPIhA/viewform?usp=sf_link"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  <QuestionAnswerOutlinedIcon className="text-xl mr-2" />
                  お問い合わせ
                </MenuItem>
                <MenuItem
                  onClick={handleMenuClose}
                  component={Link}
                  to="/terms"
                  className="flex items-center"
                >
                  <GavelOutlinedIcon className="text-xl mr-2" />
                  利用規約
                </MenuItem>
                <MenuItem
                  onClick={handleMenuClose}
                  component={Link}
                  to="/privacy"
                  className="flex items-center"
                >
                  <PolicyOutlinedIcon className="text-xl mr-2" />
                  プライバシーポリシー
                </MenuItem>

                {/* サインアウトボタン */}
                <MenuItem
                  onClick={() => {
                    handleSignOut();
                    handleMenuClose();
                  }}
                  className="flex items-center"
                >
                  <LogoutOutlinedIcon className="text-xl mr-2" />
                  サインアウト
                </MenuItem>
              </Menu>
            </div>
          </div>
        ) : (
          // 未ログイン時の表示
          <div className="ml-auto flex flex-col md:flex-row items-center">
            <Link to="/" className="text-xl text-[#2EA9DF] md:mr-2 flex items-center">
              <HelpOutlineOutlinedIcon />
              使い方
            </Link>
            <SignInButton>
              <span
                className={`text-xl text-[#2EA9DF] flex items-center ${
                  location.pathname === '/signin' ? 'sidebar-link active' : 'sidebar-link'
                }`}
              >
                ログイン
              </span>
            </SignInButton>
          </div>
        )}
      </header>

      {/* ヘッダーの高さ分のスペース確保 */}
      <div className="h-12" />
    </>
  );
};

export default Header;
