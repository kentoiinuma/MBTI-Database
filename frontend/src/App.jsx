import React from 'react';
import './App.css';
import {
 ClerkProvider,
 SignedIn,
 SignedOut,
 UserButton,
 useUser,
 RedirectToSignIn,
} from '@clerk/clerk-react';

const clerk_pub_key = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY

function App() {
  return (
    <ClerkProvider publishableKey={clerk_pub_key}>
 
      <SignedIn>
        <Hello />
      </SignedIn>
 
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
 
    </ClerkProvider>
  );
 }
 
 
function Hello() {
  const { user } = useUser();
  
  return (
    <div className="App-header">
      <UserButton />
      <h1>Hello, {user.username}!!!</h1>
    </div>
  );
}

 export default App;

