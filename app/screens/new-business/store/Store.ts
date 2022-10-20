import create from "zustand";

const useAddBusinessStore = create((set) => ({
    name: '',
    description: '',
    category: [],
    facilities: [],

    setName: (name: string) => set((state: any) => ({name})),
    setDescription: (description: string) => set((state: any) => ({description})),
    setCategory: (category: array) => set((state: any) => ({category})),
    setFacilities: (facilities: string) => set((state: any) => ({facilities}))
    

}));

export default useAddBusinessStore;