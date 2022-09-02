import { createContext } from 'react';

interface contextInterface {
  name: string;
  author: string;
  url: string;
}

const AddBusinessContext = createContext<contextInterface | null>(null);

export default AddBusinessContext;
