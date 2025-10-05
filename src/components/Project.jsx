import React from 'react';

const Project = ({ projects }) => {
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Projects (24) <span className="text-red-500 ml-2">+ Add</span></h2>
        <div className="flex space-x-4">
          <select className="border rounded p-2">
            <option>By owner</option>
            <option>By tool</option>
            <option>By publish status</option>
            <option>By label</option>
          </select>
          <input type="text" placeholder="Search projects" className="border rounded p-2" />
          <button className="bg-blue-500 text-white px-4 py-2 rounded">Newest create</button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {projects.map((project, index) => (
          <div key={index} className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <img src={project.image} alt={project.name} className="w-full h-48 object-cover" />
            <div className="p-4">
              <div className="flex items-center justify-between">
                <span className={`text-sm ${project.published ? 'text-green-500' : 'text-gray-500'}`}>
                  {project.published ? '● Published' : '● Unpublished'}
                </span>
                <span className="text-sm text-gray-600">{project.owner}</span>
              </div>
              <h3 className="text-lg font-semibold mt-2">{project.name || 'Untitled project'}</h3>
              <p className="text-sm text-gray-500 mt-1">Created {project.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Project;
