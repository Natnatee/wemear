import React from "react";
import { useNavigate } from "react-router-dom";

const CardProject = ({ project }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/project/${project.project_id}`);
  };

  return (
    <div
      className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow relative cursor-pointer"
      onClick={handleClick}
    >
      <img
        src={project.image}
        alt={project.name}
        className="w-full h-48 object-cover"
      />
      <img
        src="/weme_ar_shadow.jpg"
        alt="wemear"
        className="absolute top-42 left-6 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 object-cover rounded-full shadow"
      />
      {project.label && (
        <div className="absolute top-2 left-2 bg-white text-blue-500 text-sm font-semibold px-2 py-1 rounded border border-gray-200">
          {project.label}
        </div>
      )}
      <div className="py-8 px-6">
        <div className="flex justify-between">
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <circle
                cx="12"
                cy="12"
                r="7"
                fill={project.status === "Published" ? "#39FF14" : "gray"}
                className={
                  project.status === "Published"
                    ? "filter drop-shadow-[0_0_4px_#39FF14]"
                    : ""
                }
              />
            </svg>
            <span className="text-sm text-gray-700">{project.name}</span>
          </div>
          <div>
            {project.owner}
          </div>
        </div>

        <p className="text-sm text-gray-500 mt-1">
          Created {project.date} | {project.status}
        </p>
      </div>
    </div>
  );
};

export default CardProject;
