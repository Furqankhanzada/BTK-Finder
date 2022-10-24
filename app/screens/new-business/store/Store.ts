import create from "zustand";

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

    setName: (name: string) => set((state: any) => ({name})),
    setDescription: (description: string) => set((state: any) => ({description})),
    setCategory: (category: any) => set((state: any) => ({category})),
    setFacilities: (facilities: any) => set((state: any) => ({facilities})),
    setTags: (tags: any) => set((state: any) => ({tags})),
    setTelephone: (telephone: any) => set((state: any) => ({telephone})),
    setEmail: (email: string) => set((state: any) => ({email})),
    setWebsite: (website: string) => set((state: any) => ({website})),
    setEstablished: (established: Date) => set((state: any) => ({established})),
    setAddress: (address: any) => set((state: any) => ({address}))

}));

export default useAddBusinessStore;