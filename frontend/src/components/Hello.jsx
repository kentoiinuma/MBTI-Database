// Hello.jsx
import React from 'react';
import { UserButton, useUser } from '@clerk/clerk-react';

export function Hello() {
  const { user } = useUser();
  
  // Tailwind CSSを適用したスタイル
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-2xl text-black">
      <UserButton />
      <h1>Hello, {user.username}!!!</h1>
    </div>
  );
}
