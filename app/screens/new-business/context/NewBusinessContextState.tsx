import React from 'react';
import { NewBusinessContext } from '../context/NewBusinessContext';

export const NewBusinessContextState = (props: any) => {
  let dumy = {
    name: 'Shahmir',
    class: 'React-Native',
  };
  return (
    <NewBusinessContext.Provider value={dumy}>
      {props.children}
    </NewBusinessContext.Provider>
  );
};
