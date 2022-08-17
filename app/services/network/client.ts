import { ApolloClient, InMemoryCache } from '@apollo/client';
import { QueryClient } from '@tanstack/react-query';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistQueryClient } from '@tanstack/react-query-persist-client';

export const apolloClient = new ApolloClient({
  uri: 'https://explore-btk-opencommerce-apis.ceultnteo3kpk.ap-southeast-1.cs.amazonlightsail.com/graphql',
  cache: new InMemoryCache({}),
});

export const reactQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // cacheTime: 1000 * 60 * 60 * 24, // 24 hours
      cacheTime: Infinity,
      staleTime: 1000 * 60 * 60,
    },
  },
});

const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
});

persistQueryClient({
  queryClient: reactQueryClient,
  persister: asyncStoragePersister,
});
