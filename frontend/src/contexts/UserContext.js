import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [userUpdated, setUserUpdated] = useState(false);

  return (
    <UserContext.Provider value={{ userUpdated, setUserUpdated }}>
      {children}
    </UserContext.Provider>
  );
};
