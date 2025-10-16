// projectStore.js

import { create } from "zustand";

const projectStore = create((set) => ({
  project: [], // กลับไปเป็นค่าเริ่มต้น (State ว่าง)
  setProject: (newProject) => set({ project: newProject }),
  removeAllProjects: () => set({ project: [] }),
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
