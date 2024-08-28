import React, { useState, useCallback, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react'; // Clerkを使ったユーザー認証のためのフック
import Header from './Header';
import MBTIModal from './MBTIModal'; // MBTIモーダルのインポート
import Profile from './Profile';
import ImageContentPost from './ImageContentPost';
import AllPosts from './AllPosts';
import TermsOfService from './TermsOfService';
import PrivacyPolicy from './PrivacyPolicy';
import AboutApp from './AboutApp';
import Contact from './Contact';
import PostDetail from './PostDetail'; // PostDetailのインポート
import { Snackbar, Alert } from '@mui/material'; // MUI SnackbarとAlertのインポート
import { useUserContext } from '../contexts/UserContext'; // UserContextのインポート

function MainContent() {
  const [showMBTIModal, setShowMBTIModal] = useState(false); // MBTIモーダルの表示態を管理するステート
  const { isSignedIn, user, loading } = useUser(); // ユーザーのサインイン状態、ユーザー情報、ローディングを���得
  const [snackbarOpen, setSnackbarOpen] = useState(false); // スナックバーの表示状態
  // const [snackbarMessage, setSnackbarMessage] = useState(''); // スナックバーのメッセージ（現在は使用していないためコメントアウト）
  const { setUserUpdated } = useUserContext(); // UserContextからsetUserUpdatedを取得
  const navigate = useNavigate(); // useNavigateフックを使用

  let API_URL; // APIのURLを格納する変数
  // 環境に応じてAPIのURLを設定
  if (window.location.origin === 'http://localhost:3001') {
    API_URL = 'http://localhost:3000';
  } else if (window.location.origin === 'https://www.mbti-database.com') {
    API_URL = 'https://api.mbti-database.com';
  } else {
    // デフォルトのURL
    API_URL = 'http://localhost:3000';
  }

  // サインイン処理を行う関数
  const handleSignIn = useCallback(async () => {
    if (user) {
      // バックエンドにユーザー情報を送して新規ユーーかどうかを確認
      const response = await fetch(`${API_URL}/api/v1/registrations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clerk_user_id: user.id,
        }),
      });
      const data = await response.json();

      // スナックバーを表示（すべてのユーザーのサインイン時）
      // setSnackbarMessage('サインインしました！');
      // setSnackbarOpen(true);

      // 新規ユーザーの合のみ、ユーザーネームとアイコンURLを送信
      if (data.is_new_user) {
        // 新規ユーザーの場合はMBTIモーダルを表示
        setShowMBTIModal(true);

        // ユーザーネームとアイコンURLをバックエンドに送信
        await fetch(`${API_URL}/api/v1/registrations`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            clerk_user_id: user.id,
            username: user.firstName + ' ' + user.lastName, // Clerkからユーザーネームを組み立てる
            profile_image_url: user.profileImageUrl, // ClerkからユーザーアイコンのURLを取得
          }),
        });

        // 新規ユーザー登録後にUserContextの状態を更新
        setUserUpdated(true);
      }
    }
  }, [user, API_URL, setUserUpdated]);

  // サインアウト処理を行う関数
  const handleSignOut = useCallback(() => {
    // サインアウトのスナックを表示
    // setSnackbarMessage('サインアウトしました！');
    // setSnackbarOpen(true);
  }, []);

  // コンポーネントがマウントされた後、サインイン状態が変わるたびにhandleSignInを呼び出す
  useEffect(() => {
    if (!loading) {
      if (isSignedIn && user) {
        handleSignIn();
      } else if (!isSignedIn) {
        // サインアウトの処理を行う前に、以前はサインインしていかどうかを確認
        const wasSignedIn = localStorage.getItem('wasSignedIn') === 'true';
        if (wasSignedIn) {
          handleSignOut();
        }
      }
      // 現在のサインイン状態をlocalStorageに保存
      // isSignedInがundefinedの場合はfalseとして扱う
      localStorage.setItem('wasSignedIn', (isSignedIn ?? false).toString());
    }
  }, [isSignedIn, user, loading, handleSignIn, handleSignOut]);

  // MBTIモーダルを閉じる関数
  const handleCloseModal = useCallback(() => {
    setShowMBTIModal(false);
  }, []);

  // スナックバーを閉じる関数
  const handleCloseSnackbar = useCallback(() => {
    setSnackbarOpen(false);
  }, []);

  return (
    <div className="flex h-screen">
      <div className="flex flex-col flex-1 relative">
        <Header onSignIn={handleSignIn} />
        <main className="flex-1 overflow-auto">
          <Routes>
            {/* 各ルートに対応する���ンポーネを設定 */}
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:clerkId" element={<Profile />} />
            <Route path="/post" element={<ImageContentPost />} />
            <Route path="/" element={<AllPosts />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/about" element={<AboutApp />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/post/:postId" element={<PostDetail />} />
          </Routes>
          {showMBTIModal && <MBTIModal onClose={handleCloseModal} />}
        </main>
        {/* フローティングアクションボタン */}
        {isSignedIn && (
          <button
            className="fixed bottom-6 right-6 p-2 rounded-full bg-[#2EA9DF] text-white hover:bg-[#2596be] transition-colors duration-300 shadow-lg md:bottom-8 md:right-8 md:p-3"
            onClick={() => navigate('/post')}
          >
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
      <Snackbar open={snackbarOpen} autoHideDuration={2500} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {/* {snackbarMessage} */}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default MainContent;
