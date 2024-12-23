import React, { createContext, useContext, useState } from 'react';

// ユーザー情報を管理するコンテキストを作成
const UserContext = createContext();

// コンテキストを利用するためのカスタムフック
export const useUserContext = () => useContext(UserContext);

// ユーザー情報を提供するプロバイダーコンポーネント
export const UserProvider = ({ children }) => {
  const [isProfileUpdated, setIsProfileUpdated] = useState(false);

  const [profile, setProfile] = useState({
    username: '',
    avatarUrl: '',
  });

  const updateProfile = (username, avatarUrl) => {
    setProfile({ username, avatarUrl });
    setIsProfileUpdated(true);
  };

  // 子コンポーネントにコンテキストの値を提供
  return (
    <UserContext.Provider value={{ isProfileUpdated, setIsProfileUpdated, profile, updateProfile }}>
      {children}
    </UserContext.Provider>
  );
};
