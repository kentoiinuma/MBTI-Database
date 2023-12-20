// App.jsx
import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import { ClerkProvider, SignedIn } from '@clerk/clerk-react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import SignInPage from './components/SignInPage'; // サインインページのコンポーネントをインポート

const clerk_pub_key = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

function App() {
  return (
    <ClerkProvider publishableKey={clerk_pub_key}>
      <Router>
        <div className="flex h-screen">
          <Sidebar />
          <div className="flex flex-col flex-1">
            <Header />
            <main className="flex-1 overflow-auto">
              <SignedIn>
                {/* ログイン済みの場合に表示するコンテンツ */}
              </SignedIn>
              <Route path="/signin" component={SignInPage} />
            </main>
          </div>
        </div>
      </Router>
    </ClerkProvider>
  );
}

export default App;
