// App.jsx
import React from 'react';
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import { Hello } from './components/Hello';
import Header from './components/Header';
import Sidebar from './components/Sidebar';

const clerk_pub_key = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

function App() {
  return (
    <ClerkProvider publishableKey={clerk_pub_key}>
      <div className="flex flex-col h-screen">
        <Header /> {/* ヘッダーが上部に固定されるようにします */}
        <div className="flex flex-1 overflow-hidden"> {/* コンテンツとサイドバーが横並びになるようにします */}
          <Sidebar /> {/* サイドバーが左側に固定されるようにします */}
          <main className="flex-1 overflow-auto"> {/* メインコンテンツがスクロール可能になるようにします */}
            <SignedIn>
              <Hello />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </main>
        </div>
      </div>
    </ClerkProvider>
  );
}

export default App;
