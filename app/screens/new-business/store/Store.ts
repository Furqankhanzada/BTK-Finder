import { create } from 'zustand';
import {
  Facility,
  Gallery,
  Location,
  OpenHours,
  PriceRange,
} from '@screens/businesses/models/BusinessPresentable';

export type BusinessStoreTypes = {
  name?: string;
  description?: string;
  category?: string;
  facilities?: Facility[];
  tags?: Array<string>;
  telephone?: string;
  email?: string;
  website?: string;
  address?: string;
  openHours?: OpenHours[];
  priceRange?: PriceRange;
  gallery?: Gallery[];
  thumbnail?: string;
  location?: Location;
};

export type BusinessStoreActions = {
  setName: (name: string) => void;
  setDescription: (description: string) => void;
  setCategory: (category: string) => void;
  setFacilities: (facilities: Facility[]) => void;
  setTags: (tags: Array<string>) => void;
  setTelephone: (telephone: string) => void;
  setEmail: (email: string) => void;
  setWebsite: (website: string) => void;
  setAddress: (address: string) => void;
  setOpenHours: (openHours: OpenHours[]) => void;
  setPriceRange: (priceRange: PriceRange) => void;
  setGallery: (gallery: Gallery[]) => void;
  setThumbnail: (thumbnail: string) => void;
  setLocation: (location: Location) => void;
  resetAddBusinessStore: () => void;
};

const initialState: BusinessStoreTypes = {
  name: '',
  description: '',
  category: '',
  facilities: [],
  tags: [],
  telephone: '',
  email: '',
  website: '',
  address: '',
  openHours: [],
  priceRange: {},
  gallery: [],
  thumbnail: '',
};

const useAddBusinessStore = create<BusinessStoreTypes & BusinessStoreActions>(
  (set) => ({
    ...initialState,

    setName: (name) => set(() => ({ name })),
    setDescription: (description) => set(() => ({ description })),
    setCategory: (category) => set(() => ({ category })),
    setFacilities: (facilities) => set(() => ({ facilities })),
    setTags: (tags) => set(() => ({ tags })),
    setTelephone: (telephone) => set(() => ({ telephone })),
    setEmail: (email) => set(() => ({ email })),
    setWebsite: (website) => set(() => ({ website })),
    setAddress: (address) => set(() => ({ address })),
    setOpenHours: (openHours) => set(() => ({ openHours })),
    setPriceRange: (priceRange) => set(() => ({ priceRange })),
    setGallery: (gallery) => set(() => ({ gallery })),
    setThumbnail: (thumbnail) => set(() => ({ thumbnail })),
    setLocation: (location) => set(() => ({ location })),
    resetAddBusinessStore: () => set(initialState),
  }),
);

export default useAddBusinessStore;
