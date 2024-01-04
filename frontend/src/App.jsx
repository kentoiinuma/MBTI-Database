import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import MainContent from './components/MainContent'; 

const clerk_pub_key = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

function App() {
  return (
    <Router>
      <ClerkProvider publishableKey={clerk_pub_key}>
        <MainContent />
      </ClerkProvider>
    </Router>
  );
}

export default App;




