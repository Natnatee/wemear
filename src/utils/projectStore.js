// projectStore.js

import { create } from "zustand";

const projectStore = create((set) => ({
  project: null, // เปลี่ยนเป็น null เพื่อเช็คสถานะง่ายขึ้น
  setProject: (newProject) => set({ project: newProject }),
  removeAllProjects: () => set({ project: null }),
  setProjectName: (name) =>
    set((state) => ({
      project: { ...state.project, name },
    })),
  setProjectLabel: (label) =>
    set((state) => ({
      project: { ...state.project, label },
    })),
}));

export default projectStore;
