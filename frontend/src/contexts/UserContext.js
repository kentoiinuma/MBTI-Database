import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [userUpdated, setUserUpdated] = useState(false);
  // Adding state for username and avatarUrl
  const [userProfile, setUserProfile] = useState({
    username: '',
    avatarUrl: '',
  });

  // Method to update user profile information
  const updateUserProfile = (username, avatarUrl) => {
    setUserProfile({ username, avatarUrl });
    setUserUpdated(true); // Indicating that the user has been updated
  };

  return (
    <UserContext.Provider value={{ userUpdated, setUserUpdated, userProfile, updateUserProfile }}>
      {children}
    </UserContext.Provider>
  );
};
