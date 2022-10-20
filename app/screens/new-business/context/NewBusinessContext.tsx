import { createContext } from 'react';

interface ContextInterface {
  name: string;
  author: string;
  url: string;
  value?: string;
}

export const NewBusinessContext = createContext<ContextInterface | null>(null);
