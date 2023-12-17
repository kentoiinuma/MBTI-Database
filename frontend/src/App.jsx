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
      <div className="flex h-screen">
        <Sidebar /> 
        <div className="flex flex-col flex-1"> 
          <Header /> 
          <main className="flex-1 overflow-auto"> 
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
