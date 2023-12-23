import React, { useState } from 'react';
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MBTIModal from './components/MBTIModal';

const clerk_pub_key = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

function App() {
  const [showMBTIModal, setShowMBTIModal] = useState(false);

  const handleSignIn = () => {
    setShowMBTIModal(true);
  };

  return (
    <ClerkProvider publishableKey={clerk_pub_key}>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex flex-col flex-1">
          <Header onSignIn={handleSignIn} />
          <main className="flex-1 overflow-auto">
            <SignedIn>
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

