import { object } from 'yup';
import create from 'zustand';

const useAddBusinessStore = create((set) => ({
  name: '',
  description: '',
  category: '',
  facilities: [],
  tags: [],
  telephone: '',
  email: '',
  website: '',
  established: '',
  address: '',
  openHours: [],
  priceRange: {},
  gallery: [],
  thumbnail: '',
  location: object,
  isEditBusiness: false,

  setName: (name: string) => set(() => ({ name })),
  setDescription: (description: string) => set(() => ({ description })),
  setCategory: (category: string) => set(() => ({ category })),
  setFacilities: (facilities: any) => set(() => ({ facilities })),
  setTags: (tags: any) => set(() => ({ tags })),
  setTelephone: (telephone: any) => set(() => ({ telephone })),
  setEmail: (email: string) => set(() => ({ email })),
  setWebsite: (website: any) => set(() => ({ website })),
  setEstablished: (established: Date) => set(() => ({ established })),
  setAddress: (address: any) => set(() => ({ address })),
  setOpenHours: (openHours: any) => set(() => ({ openHours })),
  setPriceRange: (priceRange: any) => set(() => ({ priceRange })),
  setGallery: (gallery: any) => set(() => ({ gallery })),
  setThumbnail: (thumbnail: string) => set(() => ({ thumbnail })),
  setLocation: (location: object) => set(() => ({ location })),
  setIsEditBusiness: (isEditBusiness: boolean) =>
    set(() => ({ isEditBusiness })),
}));

export default useAddBusinessStore;
