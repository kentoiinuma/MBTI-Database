import React, { useState, useCallback } from 'react';
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MBTIModal from './components/MBTIModal';

const clerk_pub_key = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

function App() {
  const [showMBTIModal, setShowMBTIModal] = useState(false);

  // useCallbackを使用して関数をメモ化します。
  // これにより、これらの関数は入力が変更されない限り再生成されません。
  const handleSignIn = useCallback(() => {
    console.log('サインイン処理を実行');
    setShowMBTIModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    console.log('モーダルを閉じる処理を実行');
    setShowMBTIModal(false);
  }, []);

  return (
    <ClerkProvider publishableKey={clerk_pub_key}>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex flex-col flex-1">
          <Header onSignIn={handleSignIn} />
          <main className="flex-1 overflow-auto">
            <SignedIn>
              {/* handleCloseModalを直接渡し、新しい関数を生成しないようにします */}
              {showMBTIModal && <MBTIModal onClose={handleCloseModal} />}
            </SignedIn>
            <SignedOut>
              {/* サインアウト状態で表示するコンテンツ */}
            </SignedOut>
          </main>
        </div>
      </div>
    </ClerkProvider>
  );
}

export default App;


