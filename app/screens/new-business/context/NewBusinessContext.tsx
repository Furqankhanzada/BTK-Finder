import { createContext } from 'react';

interface contextInterface {
  name: string;
  author: string;
  url: string;
  value?: string;
}

export const NewBusinessContext = createContext<contextInterface | null>(null);
