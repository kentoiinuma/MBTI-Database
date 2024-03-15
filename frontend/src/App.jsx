import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import { UserProvider } from './contexts/UserContext'; // UserProviderをインポート
import MainContent from './components/MainContent';
import './App.css';

const clerk_pub_key = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

function App() {
  return (
    <Router>
      <ClerkProvider publishableKey={clerk_pub_key}>
        <UserProvider>
          {' '}
          {/* UserProviderを追加 */}
          <MainContent />
        </UserProvider>
      </ClerkProvider>
    </Router>
  );
}

export default App;
