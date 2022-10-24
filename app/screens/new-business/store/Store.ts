import create from "zustand";

let array = [
    { day: 'Monday', from: '09:00 am', to: '10:00 pm', isOpen: false },
    { day: 'Tuesday', from: '09:00 am', to: '10:00 pm', isOpen: false },
    { day: 'Wednesday', from: '09:00 am', to: '10:00 pm', isOpen: false },
    { day: 'Thursday', from: '09:00 am', to: '10:00 pm', isOpen: false },
    { day: 'Friday', from: '09:00 am', to: '10:00 pm', isOpen: false },
    { day: 'Saturday', from: '09:00 am', to: '10:00 pm', isOpen: false },
    { day: 'Sunday', from: '09:00 am', to: '10:00 pm', isOpen: false },
  ];

const useAddBusinessStore = create((set) => ({
    name: '',
    description: '',
    category: [],
    facilities: [],
    tags: [],
    telephone: [],
    email: '',
    website: '',
    established: '',
    address: '',
    openHours: array,
    priceRange: [],

    setName: (name: string) => set((state: any) => ({name})),
    setDescription: (description: string) => set((state: any) => ({description})),
    setCategory: (category: any) => set((state: any) => ({category})),
    setFacilities: (facilities: any) => set((state: any) => ({facilities})),
    setTags: (tags: any) => set((state: any) => ({tags})),
    setTelephone: (telephone: any) => set((state: any) => ({telephone})),
    setEmail: (email: string) => set((state: any) => ({email})),
    setWebsite: (website: string) => set((state: any) => ({website})),
    setEstablished: (established: Date) => set((state: any) => ({established})),
    setAddress: (address: any) => set((state: any) => ({address})),
    setOpenHours: (openHours: any) => set((state: any) => ({openHours})),
    setPriceRange: (priceRange: any) => set((state: any) => ({priceRange})),

}));

export default useAddBusinessStore;