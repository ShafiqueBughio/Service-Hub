import { create } from 'zustand';

const useTokenStore = create(

    (set) => ({
      accessToken: null,
      setAccessToken: (accessToken) => set({ accessToken }),
      clearAccessToken: () => set({ accessToken: null }),
    }),
);

export default useTokenStore;
