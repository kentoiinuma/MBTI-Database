import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react'; // Clerkを使ったユーザー認証のためのフック
import Header from './Header';
import Sidebar from './Sidebar';
import MBTIModal from './MBTIModal'; // MBTIモーダルのインポート
import Profile from './Profile';
import ImageContentPost from './ImageContentPost';
import AllPosts from './AllPosts';
import Se from './Se';
import Si from './Si';
import Ne from './Ne';
import Ni from './Ni';
import Notifications from './Notifications';
import TermsOfService from './TermsOfService';
import PrivacyPolicy from './PrivacyPolicy';
import AboutApp from './AboutApp';
import Contact from './Contact';
import { Snackbar, Alert } from '@mui/material'; // MUI SnackbarとAlertのインポート

function MainContent() {
  const [showMBTIModal, setShowMBTIModal] = useState(false); // MBTIモーダルの表示状態を管理するステート
  const { isSignedIn, user } = useUser(); // ユーザーのサインイン状態、ユーザー情報を取得
  const [snackbarOpen, setSnackbarOpen] = useState(false); // スナックバーの表示状態
  const [snackbarMessage, setSnackbarMessage] = useState(''); // スナックバーのメッセージ

  let API_URL; // APIのURLを格納する変数
  // 環境に応じてAPIのURLを設定
  if (window.location.origin === 'http://localhost:3001') {
    API_URL = 'http://localhost:3000';
  } else if (
    window.location.origin ===
    'https://favorite-database-16type-f-5f78fa224595.herokuapp.com'
  ) {
    API_URL = 'https://favorite-database-16type-5020d6339517.herokuapp.com';
  } else {
    // デフォルトのURL
    API_URL = 'http://localhost:3000';
  }

  // サインイン処理を行う関数
  const handleSignIn = useCallback(async () => {
    console.log('handleSignIn called'); // デバッグ用のログを追加
    if (user) {
      // バックエンドにユーザー情報を送信して新規ユーザーかどうかを確認
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

      if (data.is_new_user) {
        setShowMBTIModal(true);

        await fetch(`${API_URL}/api/v1/registrations`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            clerk_user_id: user.id,
            username: user.firstName + ' ' + user.lastName,
            profile_image_url: user.profileImageUrl,
          }),
        });
      }
    }
  }, [user, API_URL]);

  const prevIsSignedInRef = useRef(isSignedIn);

  useEffect(() => {
    const handleRouteChange = () => {
      // URLが手動で更新されたときには何もしない
    };

    window.addEventListener('popstate', handleRouteChange);
    window.addEventListener('pushState', handleRouteChange);
    window.addEventListener('replaceState', handleRouteChange);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('pushState', handleRouteChange);
      window.removeEventListener('replaceState', handleRouteChange);
    };
  }, []);

  useEffect(() => {
    console.log('isSignedIn:', isSignedIn); // ステートの値を出力
    if (prevIsSignedInRef.current !== undefined) {
      if (isSignedIn && !prevIsSignedInRef.current) {
        handleSignIn();
        setSnackbarMessage('サインインしました！');
        setSnackbarOpen(true);
      } else if (!isSignedIn && prevIsSignedInRef.current) {
        setSnackbarMessage('サインアウトしました！');
        setSnackbarOpen(true);
      }
    }
    prevIsSignedInRef.current = isSignedIn;
    localStorage.setItem('wasSignedIn', (isSignedIn ?? false).toString());
  }, [isSignedIn, handleSignIn]);

  useEffect(() => {
    console.log('Snackbar Open State:', snackbarOpen);
  }, [snackbarOpen]);

  const handleCloseModal = useCallback(() => {
    setShowMBTIModal(false);
  }, []);

  const handleCloseSnackbar = useCallback(() => {
    setSnackbarOpen(false);
  }, []);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header onSignIn={handleSignIn} />
        <main className="flex-1 overflow-auto pl-69">
          <Routes>
            {/* 各ルートに対応するコンポーネントを設定 */}
            <Route path="/profile" element={<Profile />} />
            <Route path="/post" element={<ImageContentPost />} />
            <Route path="/" element={<AllPosts />} />
            <Route path="/Se" element={<Se />} />
            <Route path="/Si" element={<Si />} />
            <Route path="/Ne" element={<Ne />} />
            <Route path="/Ni" element={<Ni />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/about" element={<AboutApp />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
          {showMBTIModal && <MBTIModal onClose={handleCloseModal} />}{' '}
          {/* MBTIモーダルを表示 */}
        </main>
      </div>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2500}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default MainContent;
