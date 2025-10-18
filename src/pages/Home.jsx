import React, { useMemo, useState, useEffect } from "react";
import Dashboard from "@/components/Dashboard";
import { useProjects } from "../hook/useProject";

function Home() {
  const { data: projects = [], isLoading, error } = useProjects();

  // Get workspace info from localStorage with state
  const [workspaceId, setWorkspaceId] = useState(localStorage.getItem("workspace_id"));
  const [workspaceName, setWorkspaceName] = useState(localStorage.getItem("workspace_name") || "Projects");

  // Listen for workspace changes
  useEffect(() => {
    const handleWorkspaceChange = (event) => {
      setWorkspaceId(event.detail.workspace_id);
      setWorkspaceName(event.detail.workspace_name);
    };

    window.addEventListener('workspaceChanged', handleWorkspaceChange);

    return () => {
      window.removeEventListener('workspaceChanged', handleWorkspaceChange);
    };
  }, []);



  // Filter projects by workspace_id
  const filteredProjects = useMemo(() => {
    if (!workspaceId) {
      return projects;
    }
    return projects.filter(project => project.workspace_id === workspaceId);
  }, [projects, workspaceId]);

  console.log(filteredProjects);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading projects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-2">Failed to load projects</p>
          <p className="text-gray-500 text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  return <Dashboard projects={filteredProjects} workspaceName={workspaceName} />;
}

export default Home;
