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
import { getApiUrl } from '../utils/apiUrl';

function RootLayout() {
  // 状態管理
  const [showMBTIModal, setShowMBTIModal] = useState(false);

  // Clerk やカスタムコンテキスト関連
  const { isSignedIn, user, loading } = useUser();
  const { setIsProfileUpdated } = useUserContext();

  const navigate = useNavigate();

  /**
   * 新規ユーザーの場合のサインイン処理
   */
  const handleSignIn = useCallback(async () => {
    if (!user?.id) return;

    try {
      const registrationRes = await fetch(`${getApiUrl()}/registrations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clerk_id: user.id }),
      });

      const registrationData = await registrationRes.json();

      if (registrationData.is_new_user) {
        setShowMBTIModal(true);
        setIsProfileUpdated(true);
      }
    } catch (error) {
      console.error(`[RootLayout] サインイン時の登録に失敗しました: ${error.message}`, error);
    }
  }, [user, setIsProfileUpdated]);

  /**
   * MBTIモーダルを閉じる
   */
  const handleCloseModal = useCallback(() => {
    setShowMBTIModal(false);
  }, []);

  /**
   * ログイン済みの場合はサインイン処理を実行
   */
  useEffect(() => {
    if (!loading && isSignedIn && user) {
      handleSignIn();
    }
  }, [loading, isSignedIn, user, handleSignIn]);

  return (
    <div className="flex h-screen text-gray-800 bg-off-white">
      <div className="relative flex flex-col flex-1">
        <Header />

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
          {showMBTIModal && (
            <MBTIModal
              onClose={handleCloseModal}
              onUpdate={() => {}}
              initialMBTI=""
              initialVisibility="is_public"
            />
          )}
        </main>

        {/* 新規投稿ボタン */}
        {isSignedIn && (
          <button
            className="fixed bottom-6 right-6 p-2 rounded-full bg-[#2EA9DF] text-white hover:bg-[#2596be] 
                       transition-colors duration-300 shadow-lg md:bottom-8 md:right-8 md:p-3"
            onClick={() => navigate('/posts/new')}
          >
            {/* プラスアイコン */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
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
