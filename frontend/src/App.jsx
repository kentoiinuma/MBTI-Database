import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import { UserProvider } from './contexts/UserContext';
import RootLayout from './components/RootLayout';
import './App.css';

const clerk_pub_key = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

function App() {
  return (
    <Router>
      {/* ClerkProviderでラップし、Clerkが提供する情報がアプリ全体で利用可能にする */}
      <ClerkProvider publishableKey={clerk_pub_key}>
        {/* UserProviderでラップし、グローバルなユーザー状態を管理可能にする */}
        <UserProvider>
          <RootLayout />
        </UserProvider>
      </ClerkProvider>
    </Router>
  );
}

export default App;
