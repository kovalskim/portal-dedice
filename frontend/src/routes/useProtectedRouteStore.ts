import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { BACKLINK_KEY } from '@frontend/constants.ts';

type ProtectedRouteStore = {
  backlink?: string | null;
  setBacklink: (path: string) => void;
  removeBacklink: () => void;
};

export const useProtectedRouteStore = create(
  persist<ProtectedRouteStore>(
    (set) => ({
      backlink: null,
      setBacklink: (path) => set({ backlink: path }),
      removeBacklink: () => {
        set({ backlink: null });
      },
    }),

    {
      name: BACKLINK_KEY,
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
