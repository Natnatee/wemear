import React, { useState } from "react";
import Card from "./Card";

const Project = ({ projects }) => {
  const [filters, setFilters] = useState({
    owner: "",
    tool: "",
    status: "",
    label: "",
    date: "",
    search: "",
  });

  // ดึงรายการที่ไม่ซ้ำกันจากข้อมูล
  const uniqueOwners = [...new Set(projects.map((p) => p.owner))];
  const uniqueTools = [...new Set(projects.map((p) => p.tool))];
  const uniqueStatuses = [...new Set(projects.map((p) => p.status))];
  const uniqueLabels = [...new Set(projects.map((p) => p.label))];
  // ไม่ต้องใช้ uniqueDates เพราะจะกรองโดยการเรียงลำดับ

  // ฟังก์ชันกรองแบบ intersect
  const filteredProjects = projects
    .filter((project) => {
      const matchesOwner = !filters.owner || project.owner === filters.owner;
      const matchesTool = !filters.tool || project.tool === filters.tool;
      const matchesStatus =
        !filters.status || project.status === filters.status;
      const matchesLabel = !filters.label || project.label === filters.label;
      const matchesSearch =
        !filters.search ||
        project.name.toLowerCase().includes(filters.search.toLowerCase());
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
        return new Date(b.date) - new Date(a.date);
      if (filters.date === "Older Created")
        return new Date(a.date) - new Date(b.date);
      return 0; // ไม่เรียงถ้าไม่ได้เลือก
    });

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4 min-h-[60px]">
        <h2 className="text-2xl font-bold p-2 flex items-center">
          Projects ({projects.length}){" "}
          <button className="text-red-500 ml-2 inline-block border border-transparent hover:border-2 hover:border-red-500 rounded px-2 py-1">
            + Add
          </button>
        </h2>
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
      <div className="my-4 flex justify-between">
        <div className="flex space-x-4">
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
        {filteredProjects.map((project, index) => (
          <Card key={index} project={project} />
        ))}
      </div>
    </div>
  );
};

export default Project;
