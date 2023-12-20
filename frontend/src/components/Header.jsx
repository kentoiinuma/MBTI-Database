// Header.jsx
import React from 'react';
import { useUser, UserButton } from '@clerk/clerk-react';
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { isSignedIn, user } = useUser();
  const navigate = useNavigate();

  return (
    <header className="flex justify-between items-center p-4 bg-white text-black border-b border-[#7DB9DE]">
      {/* isSignedInがtrueの場合にユーザー名とUserButtonを表示 */}
      {isSignedIn ? (
        <>
          <span className="text-xl font-semibold">{user?.firstName}</span>
          <div className="flex items-center">
            {/* 他のボタンやコンテンツをここに配置 */}
            <UserButton /> {/* Clerkから提供されるユーザーアイコン */}
          </div>
        </>
      ) : (
        <div className="ml-auto">
          {/* サインインしていないときに表示する要素 */}
          <button className="btn btn-primary mr-4">?</button>
          {/* サインイン画面を開くボタン */}
          <button className="btn btn-primary" onClick={() => navigate('/signin')}>⇒</button>
        </div>
      )}
    </header>
  );
};

export default Header;
