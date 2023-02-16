import { create } from 'zustand';
import {
  Facility,
  Gallery,
  Location,
  OpenHours,
  PriceRange,
} from '@screens/businesses/models/BusinessPresentable';

export type BusinessStoreTypes = {
  name: string;
  description: string;
  category: string;
  facilities: Facility[];
  tags: Array<string>;
  telephone: string;
  email: string;
  website: string;
  address: string;
  openHours: OpenHours[];
  priceRange: PriceRange;
  gallery: Gallery[];
  thumbnail: string;
  location: Location;
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
  location: { coordinates: [] },
};

const useAddBusinessStore = create<BusinessStoreTypes & BusinessStoreActions>(
  (set) => ({
    ...initialState,

    setName: (name: string) => set(() => ({ name })),
    setDescription: (description: string) => set(() => ({ description })),
    setCategory: (category: string) => set(() => ({ category })),
    setFacilities: (facilities: Facility[]) => set(() => ({ facilities })),
    setTags: (tags: Array<string>) => set(() => ({ tags })),
    setTelephone: (telephone: string) => set(() => ({ telephone })),
    setEmail: (email: string) => set(() => ({ email })),
    setWebsite: (website: string) => set(() => ({ website })),
    setAddress: (address: string) => set(() => ({ address })),
    setOpenHours: (openHours: OpenHours[]) => set(() => ({ openHours })),
    setPriceRange: (priceRange: PriceRange) => set(() => ({ priceRange })),
    setGallery: (gallery: Gallery[]) => set(() => ({ gallery })),
    setThumbnail: (thumbnail: string) => set(() => ({ thumbnail })),
    setLocation: (location: Location) => set(() => ({ location })),
    resetAddBusinessStore: () => set(() => initialState),
  }),
);

export default useAddBusinessStore;
