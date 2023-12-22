// src/App.jsx
import React, { useState, useEffect } from 'react';
import { ClerkProvider, SignedIn, SignedOut, useUser } from '@clerk/clerk-react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MBTIModal from './components/MBTIModal'; // 確認してください: コンポーネントのパスが正しいかどうか

const clerk_pub_key = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

function App() {
  const { isSignedIn } = useUser();
  const [showMBTIModal, setShowMBTIModal] = useState(false);

  // サインイン状態の変化を監視し、サインアップ直後にMBTIモーダルを表示する
  useEffect(() => {
    if (isSignedIn) {
      setShowMBTIModal(true);
    }
  }, [isSignedIn]);

  return (
    <ClerkProvider publishableKey={clerk_pub_key}>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex flex-col flex-1">
          <Header />
          <main className="flex-1 overflow-auto">
            <SignedIn>
              {/* ログイン済みの場合に表示するコンテンツ */}
              {showMBTIModal && <MBTIModal onClose={() => setShowMBTIModal(false)} />}
            </SignedIn>
            <SignedOut>
              {/* サインアウト状態の場合に表示するコンテンツ */}
            </SignedOut>
          </main>
        </div>
      </div>
    </ClerkProvider>
  );
}

export default App;
