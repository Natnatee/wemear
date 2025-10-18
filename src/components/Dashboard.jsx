import React, { useState } from "react";
import CardProject from "@/components/CardProject";
import ModalTool from "@/components/ModalTool";

const Dashboard = ({ projects }) => {
  const [filters, setFilters] = useState({
    owner: "",
    tool: "",
    status: "",
    label: "",
    date: "",
    search: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const uniqueOwners = [...new Set(projects.map((p) => p.owner))];
  const uniqueTools = [...new Set(projects.map((p) => p.tool))];
  const uniqueStatuses = [...new Set(projects.map((p) => p.status))];
  const uniqueLabels = [...new Set(projects.map((p) => p.label))];

  const filteredProjects = projects
    .filter((project) => {
      const matchesOwner = !filters.owner || project.owner === filters.owner;
      const matchesTool = !filters.tool || project.tool === filters.tool;
      const matchesStatus =
        !filters.status || project.status === filters.status;
      const matchesLabel = !filters.label || project.label === filters.label;
      const matchesSearch =
        !filters.search ||
        project.project_name.toLowerCase().includes(filters.search.toLowerCase());
      return (
        matchesOwner &&
        matchesTool &&
        matchesStatus &&
        matchesLabel &&
        matchesSearch
      );
    })
    .sort((a, b) => {
      if (filters.date === "Newest Created")
        return new Date(b.created_at) - new Date(a.created_at);
      if (filters.date === "Older Created")
        return new Date(a.created_at) - new Date(b.created_at);
      return 0;
    });

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // Handle click outside modal
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      toggleModal();
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 min-h-[60px] gap-4">
        <div className="flex items-center">
          <h2 className="text-2xl font-bold p-2 flex items-center">
            Projects ({projects.length}){" "}
            <button
              className="text-red-500 ml-2 inline-block border border-transparent hover:border-2 hover:border-red-500 rounded px-2 py-1"
              onClick={toggleModal}
            >
              + Add
            </button>
          </h2>
        </div>
        <div className="flex space-x-4 items-center">
          <input
            type="text"
            placeholder="Search projects"
            className="border rounded p-2"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            List
          </button>
        </div>
      </div>
      <div className="my-4 flex flex-wrap justify-between gap-4">
        <div className="flex flex-wrap gap-4">
          <select
            className="border rounded p-2"
            value={filters.owner}
            onChange={(e) => setFilters({ ...filters, owner: e.target.value })}
          >
            <option value="">By Owner</option>
            {uniqueOwners.map((owner, index) => (
              <option key={index} value={owner}>
                {owner}
              </option>
            ))}
          </select>
          <select
            className="border rounded p-2"
            value={filters.tool}
            onChange={(e) => setFilters({ ...filters, tool: e.target.value })}
          >
            <option value="">By Tool</option>
            {uniqueTools.map((tool, index) => (
              <option key={index} value={tool}>
                {tool}
              </option>
            ))}
          </select>
          <select
            className="border rounded p-2"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">By Publish Status</option>
            {uniqueStatuses.map((status, index) => (
              <option key={index} value={status}>
                {status}
              </option>
            ))}
          </select>
          <select
            className="border rounded p-2"
            value={filters.label}
            onChange={(e) => setFilters({ ...filters, label: e.target.value })}
          >
            <option value="">By Label</option>
            {uniqueLabels.map((label, index) => (
              <option key={index} value={label}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <select
            className="border rounded p-2"
            value={filters.date}
            onChange={(e) => setFilters({ ...filters, date: e.target.value })}
          >
            <option value="">By Created</option>
            <option value="Newest Created">Newest Created</option>
            <option value="Older Created">Older Created</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProjects.map((project) => (
          <CardProject key={project.project_id} project={project} />
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn "
          onClick={handleOverlayClick}
        >
          <div className="bg-white  rounded-lg shadow-lg relative animate-slideIn">
            {/* Close Button */}
            <button
              className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-white border-2 border-red-500 rounded-full hover:bg-red-50 transition-colors"
              onClick={toggleModal}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 4L4 12M4 4L12 12"
                  stroke="#EF4444"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
            {/* Modal Content (Empty for now) */}
            <div className="p-4">
              <h2 className="text-xl font-bold  text-gray-800 text-center">
                Select Tool
              </h2>
              <ModalTool />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
