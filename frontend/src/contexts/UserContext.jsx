// UserContext.jsx
import React, { createContext, useContext, useState, useMemo } from 'react';

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

  // useMemoで値をメモ化することで、再レンダリングの最適化を図る
  const contextValue = useMemo(
    () => ({ isProfileUpdated, setIsProfileUpdated, profile, updateProfile }),
    [isProfileUpdated, profile]
  );

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
};
