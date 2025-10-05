import React from "react";
import { modalTool } from "../make_data/modal_tool.js";

const ModalTool = () => {
  // เรียงให้ Active มาก่อน
  const sortedTools = [...modalTool].sort((a, b) => {
    if (a.status === "Active" && b.status !== "Active") return -1;
    if (a.status !== "Active" && b.status === "Active") return 1;
    return 0;
  });

  return (
    <div className="p-6 max-h-[80vh] overflow-y-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedTools.map((tool, index) => (
          <button
            key={index}
            className={`relative bg-white rounded-xl shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg ${
              tool.status === "Active"
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
                className={`text-sm font-semibold mb-1 ${
                  tool.status === "Active" ? "text-blue-700" : "text-gray-500"
                }`}
              >
                {tool.name}
              </h3>
              <p
                className={`text-xs leading-relaxed ${
                  tool.status === "Active" ? "text-gray-600" : "text-gray-400"
                }`}
              >
                {tool.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ModalTool;
