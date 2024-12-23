// アプリ全体のルートレイアウトを定義

import React, { useState, useCallback, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import Header from './Header';
import MBTIModal from './MBTIModal';
import UserProfile from './UserProfile';
import PostNew from './PostNew';
import PostsIndex from './PostsIndex';
import TermsOfService from './TermsOfService';
import PrivacyPolicy from './PrivacyPolicy';
import AboutApp from './AboutApp';
import PostShow from './PostShow';
import { useUserContext } from '../contexts/UserContext';

function getAPIUrl() {
  // 環境に応じてAPIエンドポイントを切り替え
  const { origin } = window.location;
  if (origin === 'http://localhost:3001') return 'http://localhost:3000';
  if (origin === 'https://www.mbti-database.com') return 'https://api.mbti-database.com';
}

function RootLayout() {
  const [showMBTIModal, setShowMBTIModal] = useState(false);
  const { isSignedIn, user, loading } = useUser();
  const { setIsProfileUpdated } = useUserContext();
  const navigate = useNavigate();
  const API_URL = getAPIUrl();

  // 新規ユーザーの場合はMBTIモーダルを表示
  const handleSignIn = useCallback(async () => {
    const response = await fetch(`${API_URL}/api/v1/registrations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clerk_id: user.id }),
    });
    const data = await response.json();

    if (data.is_new_user) {
      setShowMBTIModal(true);
      setIsProfileUpdated(true);
    }
  }, [user, API_URL, setIsProfileUpdated]);

  // MBTIモーダルを閉じる
  const handleCloseModal = useCallback(() => {
    setShowMBTIModal(false);
  }, []);

  // ログイン済みの場合にサインイン処理を実行
  useEffect(() => {
    if (!loading && isSignedIn && user) {
      handleSignIn();
    }
  }, [isSignedIn, user, loading, handleSignIn]);

  return (
    <div className="flex h-screen text-gray-800 bg-off-white">
      <div className="flex flex-col flex-1 relative">
        {/* ヘッダーコンポーネント */}
        <Header onSignIn={handleSignIn} />
        <main className="flex-1 overflow-auto">
          {/* ルーティング設定 */}
          <Routes>
            <Route path="/" element={<AboutApp />} />
            <Route path="/posts" element={<PostsIndex />} />
            <Route path="/posts/new" element={<PostNew />} />
            <Route path="/posts/:postId" element={<PostShow />} />
            <Route path="/users" element={<UserProfile />} />
            <Route path="/users/:clerkId" element={<UserProfile />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
          </Routes>

          {/* MBTI入力モーダル */}
          {showMBTIModal && <MBTIModal onClose={handleCloseModal} onUpdate={() => {}} />}
        </main>

        {/* 新規投稿ボタン */}
        {isSignedIn && (
          <button
            className="fixed bottom-6 right-6 p-2 rounded-full bg-[#2EA9DF] text-white hover:bg-[#2596be] transition-colors duration-300 shadow-lg md:bottom-8 md:right-8 md:p-3"
            onClick={() => navigate('/posts/new')}
          >
            {/* プラスアイコン */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.0}
              stroke="currentColor"
              className="w-11 h-11 md:w-12 md:h-12"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

export default RootLayout;
