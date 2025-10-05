import React from "react";

const CardProject = ({ project }) => {
  return (
    <div className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow relative">
      <img
        src={project.image}
        alt={project.name}
        className="w-full h-48 object-cover "
      />
      {project.label && (
        <div className="absolute top-2 left-2 bg-white text-blue-500 text-sm font-semibold px-2 py-1 rounded border border-gray-200">
          {project.label}
        </div>
      )}
      <div className="p-4">
        <div className="flex items-center space-x-2">
          <svg
            className="w-4 h-4" // ขนาด svg เล็กลง
            viewBox="0 0 24 24"
          >
            <circle
              cx="14" // อยู่ตรงกลาง svg
              cy="14"
              r="7" // ปรับ radius ให้พอดีกับ svg
              fill={project.status === "Published" ? "#39FF14" : "gray"} // neon green
              className={
                project.status === "Published"
                  ? "filter drop-shadow-[0_0_4px_#39FF14]"
                  : ""
              }
            />
          </svg>
          <span className="text-sm text-gray-700">{project.name}</span>
        </div>

        <p className="text-sm text-gray-500 mt-1">Created {project.date} | {project.status}</p>
      </div>
    </div>
  );
};

export default CardProject;
