import create from "zustand";

let hoursArray = [
    { day: 'Monday', from: '09:00 am', to: '10:00 pm', isOpen: false },
    { day: 'Tuesday', from: '09:00 am', to: '10:00 pm', isOpen: false },
    { day: 'Wednesday', from: '09:00 am', to: '10:00 pm', isOpen: false },
    { day: 'Thursday', from: '09:00 am', to: '10:00 pm', isOpen: false },
    { day: 'Friday', from: '09:00 am', to: '10:00 pm', isOpen: false },
    { day: 'Saturday', from: '09:00 am', to: '10:00 pm', isOpen: false },
    { day: 'Sunday', from: '09:00 am', to: '10:00 pm', isOpen: false },
  ];

  let defaultDelta = {
    type: "Point",
    coordinates: [25.0096158, 67.1151583],
  };

const useAddBusinessStore = create((set) => ({
    name: '',
    description: '',
    category: '',
    facilities: [],
    tags: [],
    telephone: [],
    email: '',
    website: '',
    established: '',
    address: '',
    openHours: hoursArray,
    priceRange: [],
    gallery: [],
    thumbnail: '',
    location: defaultDelta,

    setName: (name: string) => set((state: any) => ({name})),
    setDescription: (description: string) => set((state: any) => ({description})),
    setCategory: (category: string) => set((state: any) => ({category})),
    setFacilities: (facilities: any) => set((state: any) => ({facilities})),
    setTags: (tags: any) => set((state: any) => ({tags})),
    setTelephone: (telephone: any) => set((state: any) => ({telephone})),
    setEmail: (email: string) => set((state: any) => ({email})),
    setWebsite: (website: any) => set((state: any) => ({website})),
    setEstablished: (established: Date) => set((state: any) => ({established})),
    setAddress: (address: any) => set((state: any) => ({address})),
    setOpenHours: (openHours: any) => set((state: any) => ({openHours})),
    setPriceRange: (priceRange: any) => set((state: any) => ({priceRange})),
    setGallery: (gallery: any) => set((state: any) => ({gallery})),
    setThumbnail: (thumbnail: string) => set((state: any) => ({thumbnail})),
    setLocation: (location: object) => set((state: any) => ({location})),
}));

export default useAddBusinessStore;