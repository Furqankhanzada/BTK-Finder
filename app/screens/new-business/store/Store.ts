import create from "zustand";

const useAddBusinessStore = create((set) => ({
    name: '',
    description: '',
    category: [],

    setName: (name: string) => set((state: any) => ({name})),
    setDescription: (description: string) => set((state: any) => ({description})),
    setCategory: (category: string) => set((state: any) => ({category}))
    

}));

export default useAddBusinessStore;