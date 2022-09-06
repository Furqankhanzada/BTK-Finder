import { createContext } from 'react';

interface contextInterface {
  name: string;
  author: string;
  url: string;
}

const NewBusinessContext = createContext<contextInterface | null>(null);

export default NewBusinessContext;
