import React, { useState, useCallback, useEffect } from 'react';
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
  const { isSignedIn, user, loading } = useUser(); // ユーザーのサインイン状態、ユーザー情報、ローディング状態を取得
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
    if (user) {
      // スナックバーを表示
      setSnackbarMessage('サインインしました！');
      setSnackbarOpen(true);
      // バックエンドにユーザーIDを送信
      const response = await fetch(`${API_URL}/api/v1/registrations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ clerk_user_id: user.id }),
      });
      const data = await response.json();
      if (data.is_new_user) {
        setShowMBTIModal(true); // 新規ユーザーの場合はMBTIモーダルを表示
      }
      // その他のレスポンス処理...
    }
  }, [user, API_URL]);

  // サインアウト処理を行う関数
  const handleSignOut = useCallback(() => {
    // サインアウトのスナックバーを表示
    setSnackbarMessage('サインアウトしました！');
    setSnackbarOpen(true);
  }, []);

  // コンポーネントがマウントされた後、サインイン状態が変わるたびにhandleSignInを呼び出す
  useEffect(() => {
    if (!loading) {
      if (isSignedIn && user) {
        handleSignIn();
      } else if (!isSignedIn) {
        // サインアウトの処理を行う前に、以前はサインインしていたかどうかを確認
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
