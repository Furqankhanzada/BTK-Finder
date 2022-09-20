import React from 'react';
import { NewBusinessContext } from '../context/NewBusinessContext';

export const NewBusinessProvider = ({ children }: any) => {
  return (
    <NewBusinessContext.Provider value="shahmir">
      {children}
    </NewBusinessContext.Provider>
  );
};
