import create from "zustand";

const useAddBusinessStore = create((set) => ({
    name: '',
    description: '',
    category: [],
    facilities: [],
    tags: [],
    telephone: [],
    email: '',

    setName: (name: string) => set((state: any) => ({name})),
    setDescription: (description: string) => set((state: any) => ({description})),
    setCategory: (category: any) => set((state: any) => ({category})),
    setFacilities: (facilities: any) => set((state: any) => ({facilities})),
    setTags: (tags: any) => set((state: any) => ({tags})),
    setTelephone: (telephone: any) => set((state: any) => ({telephone})),
    setEmail: (email: string) => set((state: any) => ({email})),
    

}));

export default useAddBusinessStore;