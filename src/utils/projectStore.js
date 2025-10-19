import { create } from "zustand";

// Debounced save to localStorage
let saveTimeout;
const debouncedSave = (project) => {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    if (project) {
      localStorage.setItem('current_project', JSON.stringify(project));
      console.log('Project auto-saved to localStorage');
    }
  }, 1000); // รอ 1 วินาทีหลังจากแก้ไขล่าสุด
};

// Load project from localStorage
const loadProjectFromStorage = () => {
  try {
    const stored = localStorage.getItem('current_project');
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error loading project from localStorage:', error);
    return null;
  }
};

const projectStore = create((set, get) => ({
  project: null,

  setProject: (newProject) => {
    set({ project: newProject });
    if (newProject) {
      debouncedSave(newProject);
    }
  },

  // Load project from localStorage
  loadProjectFromStorage: () => {
    const storedProject = loadProjectFromStorage();
    if (storedProject) {
      set({ project: storedProject });
      return true;
    }
    return false;
  },

  // Clear project and localStorage
  removeAllProjects: () => {
    set({ project: null });
    localStorage.removeItem('current_project');
    clearTimeout(saveTimeout);
  },

  setProjectName: (name) => {
    set((state) => {
      const updatedProject = { ...state.project, name };
      debouncedSave(updatedProject);
      return { project: updatedProject };
    });
  },

  setProjectLabel: (label) => {
    set((state) => {
      const updatedProject = { ...state.project, label };
      debouncedSave(updatedProject);
      return { project: updatedProject };
    });
  },

  // Manual save (สำหรับกรณีที่ต้องการ save ทันที)
  saveProject: () => {
    const { project } = get();
    if (project) {
      clearTimeout(saveTimeout);
      localStorage.setItem('current_project', JSON.stringify(project));
      console.log('Project manually saved to localStorage');
    }
  },
}));

export default projectStore;
