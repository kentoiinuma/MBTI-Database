import React, { useState, useCallback, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import Header from './Header';
import Sidebar from './Sidebar';
import MBTIModal from './MBTIModal';
import Profile from './Profile';
import ImageContentPost from './ImageContentPost';
import AllPosts from './AllPosts';
import Se from './Se';
import Si from './Si';
import Ne from './Ne';
import Ni from './Ni';
import Notifications from './Notifications';

function MainContent() {
  const [showMBTIModal, setShowMBTIModal] = useState(false);
  const { isSignedIn, user, loading } = useUser();

  let API_URL;
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

  const handleSignIn = useCallback(async () => {
    if (user) {
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
        setShowMBTIModal(true);
      }
      // その他のレスポンス処理...
    }
  }, [user, API_URL]);

  useEffect(() => {
    if (!loading && isSignedIn && user) {
      handleSignIn();
    }
  }, [isSignedIn, user, loading, handleSignIn]);

  const handleCloseModal = useCallback(() => {
    setShowMBTIModal(false);
  }, []);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header onSignIn={handleSignIn} />
        <main className="flex-1 overflow-auto pl-69">
          <Routes>
            <Route path="/profile" element={<Profile />} />
            <Route path="/post" element={<ImageContentPost />} />
            <Route path="/" element={<AllPosts />} />
            <Route path="/Se" element={<Se />} />
            <Route path="/Si" element={<Si />} />
            <Route path="/Ne" element={<Ne />} />
            <Route path="/Ni" element={<Ni />} />
            <Route path="/notifications" element={<Notifications />} />
          </Routes>
          {showMBTIModal && <MBTIModal onClose={handleCloseModal} />}
        </main>
      </div>
    </div>
  );
}

export default MainContent;
