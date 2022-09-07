import { createContext } from 'react';

interface contextInterface {
  name: string;
  author: string;
  url: string;
  value: any;
}

export const NewBusinessContext = createContext<contextInterface | null>(null);
