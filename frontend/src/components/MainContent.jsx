import React, { useState, useCallback, useEffect } from 'react';
import { useUser, SignedIn, SignedOut } from '@clerk/clerk-react';
import Header from './Header';
import Sidebar from './Sidebar';
import MBTIModal from './MBTIModal';

function MainContent() {
    const [showMBTIModal, setShowMBTIModal] = useState(false);
    const { isSignedIn, user, loading } = useUser();
  
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';
  
    const handleSignIn = useCallback(async (clerkUserId) => {
      setShowMBTIModal(true);
      // バックエンドにユーザーIDを送信
      await fetch(`${API_URL}/registrations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ clerkUserId }),
      });
    }, []);
  
    useEffect(() => {
      if (!loading && isSignedIn) {
        handleSignIn(user.id);
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
          <main className="flex-1 overflow-auto">
            <SignedIn>
              {showMBTIModal && <MBTIModal onClose={handleCloseModal} />}
            </SignedIn>
            <SignedOut>
              {/* サインアウト状態で表示するコンテンツ */}
            </SignedOut>
          </main>
        </div>
      </div>
    );
  }

export default MainContent;