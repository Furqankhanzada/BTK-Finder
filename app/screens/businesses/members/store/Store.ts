import { create } from 'zustand';

import { Package } from '@screens/settings/profile/models/UserPresentable';

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
