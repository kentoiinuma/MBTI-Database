import React from 'react';
import { ClerkProvider } from '@clerk/clerk-react';
import MainContent from './components/MainContent'; 

const clerk_pub_key = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

function App() {
  return (
    <ClerkProvider publishableKey={clerk_pub_key}>
      <MainContent />
    </ClerkProvider>
  );
}

export default App;



