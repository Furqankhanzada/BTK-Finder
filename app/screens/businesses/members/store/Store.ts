import { Package } from '@screens/businesses/models/BusinessPresentable';
import { create } from 'zustand';

export type MemberStoreStates = {
  selectedPackage: Package;
};

export type MemberStoreActions = {
  setSelectedPackage: (businessPackage: Package) => void;
  resetPackage: () => void;
};

const initialState: MemberStoreStates = {
  selectedPackage: { name: '', id: '' },
};

const useMemberStore = create<MemberStoreStates & MemberStoreActions>(
  (set) => ({
    ...initialState,

    setSelectedPackage: (selectedPackage) => set(() => ({ selectedPackage })),
    resetPackage: () => set(() => initialState),
  }),
);

export default useMemberStore;
