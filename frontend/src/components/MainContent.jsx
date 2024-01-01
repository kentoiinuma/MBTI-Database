import React, { useState, useCallback, useEffect } from 'react';

import { useUser, SignedIn, SignedOut } from '@clerk/clerk-react';
import Header from './Header';
import Sidebar from './Sidebar';
import MBTIModal from './MBTIModal';

function MainContent() {
    const [showMBTIModal, setShowMBTIModal] = useState(false);
    const { isSignedIn, user, loading } = useUser();
  
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';
  
    const handleSignIn = useCallback(async () => {
      if (user) {
        // バックエンドにユーザーIDを送信
        const response = await fetch(`${API_URL}/api/v1/registrations`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ clerk_user_id: user.id }),
        })
        const data = await response.json();
        if (data.is_new_user) {
          setShowMBTIModal(true);
        }
        // その他のレスポンス処理...
      }
    }, [user]);
  
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



