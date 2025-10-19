import React, { useState } from "react";
import { modalTool } from "../make_data/modal_tool.js";
import { useCreateProject } from "../hook/useProject";

const ModalTool = () => {
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState(null);
  const [projectName, setProjectName] = useState("");
  const createProjectMutation = useCreateProject();

  // เรียงให้ Active มาก่อน
  const sortedTools = [...modalTool].sort((a, b) => {
    if (a.status === "Active" && b.status !== "Active") return -1;
    if (a.status !== "Active" && b.status === "Active") return 1;
    return 0;
  });

  const handleToolClick = (tool) => {
    if (tool.status === "Active") {
      setSelectedTool(tool);
      setIsProjectModalOpen(true);
    }
  };

  const handleCreateProject = async () => {
    if (!projectName.trim()) {
      alert("Please enter a project name");
      return;
    }

    try {
      await createProjectMutation.mutateAsync({
        projectName: projectName.trim(),
        tool: selectedTool.tool,
      });

      // Reset and close modal
      setProjectName("");
      setIsProjectModalOpen(false);
      setSelectedTool(null);

      // Close parent modal (ModalTool modal in Dashboard)
      window.location.reload(); // หรือสามารถใช้ callback จาก props
    } catch (error) {
      console.error("Failed to create project:", error);
      alert("Failed to create project. Please try again.");
    }
  };

  const handleCloseProjectModal = () => {
    setIsProjectModalOpen(false);
    setProjectName("");
    setSelectedTool(null);
  };

  return (
    <div className="p-6 max-h-[80vh] overflow-y-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedTools.map((tool, index) => (
          <button
            key={index}
            onClick={() => handleToolClick(tool)}
            disabled={tool.status !== "Active"}
            className={`relative bg-white rounded-xl shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg ${tool.status === "Active"
                ? "cursor-pointer"
                : "cursor-not-allowed opacity-75"
              } max-w-xs mx-auto`}
          >
            {/* Coming Soon Badge */}
            {tool.status === "Inactive" && (
              <div className="absolute top-3 right-3 z-10">
                <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                  Coming Soon
                </span>
              </div>
            )}

            {/* Image */}
            <img
              src={tool.image}
              alt={tool.name}
              className="w-full h-36 object-cover"
            />

            {/* Info */}
            <div className="bg-white text-center p-4 border-t border-gray-100">
              <h3
                className={`text-sm font-semibold mb-1 ${tool.status === "Active" ? "text-blue-700" : "text-gray-500"
                  }`}
              >
                {tool.name}
              </h3>
              <p
                className={`text-xs leading-relaxed ${tool.status === "Active" ? "text-gray-600" : "text-gray-400"
                  }`}
              >
                {tool.description}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Project Name Modal */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] animate-fadeIn">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 animate-slideIn">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Create New Project
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Tool: <span className="font-semibold text-blue-600">{selectedTool?.name}</span>
            </p>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Name
              </label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleCreateProject()}
                placeholder="Enter project name..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                autoFocus
              />
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCloseProjectModal}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                disabled={createProjectMutation.isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateProject}
                disabled={createProjectMutation.isLoading || !projectName.trim()}
                className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {createProjectMutation.isLoading ? "Creating..." : "Create Project"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModalTool;
