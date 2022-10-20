import create from "zustand";

const useAddBusinessStore = create((set) => ({
    name: '',
    description: '',
    category: [],
    facilities: [],
    tags: [],

    setName: (name: string) => set((state: any) => ({name})),
    setDescription: (description: string) => set((state: any) => ({description})),
    setCategory: (category: any) => set((state: any) => ({category})),
    setFacilities: (facilities: string) => set((state: any) => ({facilities})),
    setTags: (tags: any) => set((state: any) => ({tags}))
    

}));

export default useAddBusinessStore;