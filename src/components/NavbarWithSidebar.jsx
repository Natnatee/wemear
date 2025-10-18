import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Menu,
  X,
  Users,
  ShoppingBag,
  Inbox,
  LayoutDashboard,
  LogIn,
  UserPlus,
  Plus,
  FolderPlus,
  LogOut,
  Trash2,
  Edit,
} from "lucide-react";
import { useWorkspaces, useCreateWorkspace, useDeleteWorkspace, useUpdateWorkspace } from "../hook/useWorkspace";

export default function NavbarWithSidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("");
  const [editingWorkspace, setEditingWorkspace] = useState(null);
  const [editWorkspaceName, setEditWorkspaceName] = useState("");
  const [userData2, setUserData2] = useState(null);
  const navigate = useNavigate();

  // React Query hooks
  const { data: workspaces = [], isLoading, refetch } = useWorkspaces();
  const createWorkspaceMutation = useCreateWorkspace();
  const deleteWorkspaceMutation = useDeleteWorkspace();
  const updateWorkspaceMutation = useUpdateWorkspace();

  useEffect(() => {
    // Check if user is logged in
    const userData2String = localStorage.getItem("user_data2");
    const userDataString = localStorage.getItem("user_data");

    if (userData2String) {
      try {
        setUserData2(JSON.parse(userData2String));
      } catch (error) {
        console.error("Failed to parse user_data2:", error);
      }
    } else if (userDataString) {
      // Fallback to user_data if user_data2 not available
      try {
        const userData = JSON.parse(userDataString);
        setUserData2({ user_name: userData.user_metadata?.user_name || userData.email });
      } catch (error) {
        console.error("Failed to parse user_data:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUserData2(null);
    navigate("/");
  };

  const handleAddWorkspace = () => {
    setShowCreateModal(true);
  };

  const handleCreateWorkspace = async (e) => {
    e.preventDefault();

    if (!workspaceName.trim()) {
      return;
    }

    if (!userData2 || !userData2.user_id) {
      alert("Please login first");
      return;
    }

    try {
      await createWorkspaceMutation.mutateAsync({
        workspace_name: workspaceName,
        user_id: userData2.user_id,
      });

      // Wait for refetch to complete
      await refetch();

      // Close modal and reset form
      setWorkspaceName("");
      setShowCreateModal(false);
    } catch (error) {
      console.error("Failed to create workspace:", error);
      alert("Failed to create workspace. Please try again.");
    }
  };

  const handleEditWorkspace = (workspace) => {
    setEditingWorkspace(workspace);
    setEditWorkspaceName(workspace.workspace_name);
    setShowEditModal(true);
  };

  const handleUpdateWorkspace = async (e) => {
    e.preventDefault();

    if (!editWorkspaceName.trim()) {
      return;
    }

    try {
      await updateWorkspaceMutation.mutateAsync({
        workspaceId: editingWorkspace.workspace_id,
        workspaceName: editWorkspaceName,
      });

      // Wait for refetch to complete
      await refetch();

      // Close modal and reset form
      setEditingWorkspace(null);
      setEditWorkspaceName("");
      setShowEditModal(false);
    } catch (error) {
      console.error("Failed to update workspace:", error);
      alert("Failed to update workspace. Please try again.");
    }
  };

  const handleDeleteWorkspace = async (workspaceId, workspaceName) => {
    if (!confirm(`Are you sure you want to delete "${workspaceName}"?`)) {
      return;
    }

    try {
      await deleteWorkspaceMutation.mutateAsync(workspaceId);
      // Query will automatically refetch after successful delete
    } catch (error) {
      console.error("Failed to delete workspace:", error);
      alert("Failed to delete workspace. Please try again.");
    }
  };

  const menuItems = [
    {
      name: "Project",
      icon: LayoutDashboard,
      badge: null,
      type: "modal",
    },
    // { name: "Users", icon: Users, href: "#users", badge: null },
    // { name: "Products", icon: ShoppingBag, href: "#products", badge: null },
    // { name: "Inbox", icon: Inbox, href: "#inbox", badge: "3" },
    { name: "Sign In", icon: LogIn, href: "/login", badge: null },
    { name: "Sign Up", icon: UserPlus, href: "/register", badge: null },
  ];

  const handleItemClick = (item) => {
    if (item.type === "modal") {
      setActiveModal(item.name);
    } else {
      setIsSidebarOpen(false);
      setActiveModal(null);
    }
  };

  return (
    <>
      {/* Navbar */}
      <nav className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-12">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="text-gray-600 hover:text-gray-900 focus:outline-none transition-colors"
              >
                <Menu size={24} />
              </button>
              <button onClick={() => navigate("/")} className="focus:outline-none">
                <img src="/weme_ar_tranparent.png" alt="Logo" className="h-8 w-auto" />
              </button>
            </div>
            <div className="flex items-center gap-4">
              {userData2 && (
                <>
                  <span className="text-sm text-gray-600">
                    Welcome, {userData2.user_name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1 px-2 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                  >
                    <LogOut size={14} />
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      <div className="h-12"></div>

      {/* Backdrop */}
      {(isSidebarOpen || activeModal || showCreateModal || showEditModal) && (
        <div
          className="fixed inset-0 bg-gray-900/30 z-40 transition-opacity"
          onClick={() => {
            setIsSidebarOpen(false);
            setActiveModal(null);
            setShowCreateModal(false);
            setShowEditModal(false);
          }}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-50 w-64 h-screen bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h5 className="text-base font-semibold text-gray-500 uppercase">
            Menu
          </h5>
          <button
            onClick={() => {
              setIsSidebarOpen(false);
              setActiveModal(null);
            }}
            className="text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg p-1.5 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="py-4 overflow-y-auto h-full">
          <ul className="space-y-2 px-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.name}>
                  {item.href && item.href.startsWith("/") ? (
                    <Link
                      to={item.href}
                      onClick={() => setIsSidebarOpen(false)}
                      className="w-full flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group transition-colors text-left"
                    >
                      <Icon
                        size={20}
                        className="text-gray-500 group-hover:text-gray-900 transition-colors"
                      />
                      <span className="flex-1 ml-3 whitespace-nowrap">
                        {item.name}
                      </span>
                      {item.badge && (
                        <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-medium text-blue-800 bg-blue-100 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  ) : (
                    <button
                      onClick={() => handleItemClick(item)}
                      className="w-full flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group transition-colors text-left"
                    >
                      <Icon
                        size={20}
                        className="text-gray-500 group-hover:text-gray-900 transition-colors"
                      />
                      <span className="flex-1 ml-3 whitespace-nowrap">
                        {item.name}
                      </span>
                      {item.badge && (
                        <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-medium text-blue-800 bg-blue-100 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Floating Modal (ชิดขวา sidebar) - Workspace List */}
      {activeModal && (
        <div
          className={`fixed top-14 left-1/2 -translate-x-1/2 md:left-[260px] md:translate-x-0 z-50 w-80 bg-white rounded-xl shadow-xl border border-gray-100 transition-all duration-300 ease-in-out`}
        >
          <div className="flex items-center justify-between p-4 border-b">
            <h5 className="text-base font-semibold text-gray-600 uppercase">
              my work space
            </h5>
            <button
              onClick={() => setActiveModal(null)}
              className="text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg p-1.5 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          <div className="p-4 space-y-2 max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <>
                {workspaces.map((ws) => (
                  <div
                    key={ws.workspace_id}
                    className="flex items-center gap-2 p-3 hover:bg-gray-50 rounded-lg transition-colors group"
                  >
                    <FolderPlus size={18} className="text-gray-500 flex-shrink-0" />
                    <span className="text-gray-700 flex-1">{ws.workspace_name}</span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditWorkspace(ws);
                        }}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Edit workspace"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteWorkspace(ws.workspace_id, ws.workspace_name);
                        }}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete workspace"
                        disabled={deleteWorkspaceMutation.isLoading}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  onClick={handleAddWorkspace}
                  className="w-full flex items-center justify-center p-3 mt-4 text-blue-600 hover:bg-blue-50 rounded-lg border-2 border-dashed border-blue-200 hover:border-blue-300 transition-colors"
                >
                  <Plus size={18} className="mr-2" />
                  New Workspace
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Create Workspace Modal - Center Screen */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-gray-100 w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b">
              <h5 className="text-lg font-semibold text-gray-900">
                Create New Workspace
              </h5>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setWorkspaceName("");
                }}
                className="text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg p-1.5 transition-colors"
                disabled={createWorkspaceMutation.isLoading}
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateWorkspace} className="p-6">
              <div className="mb-4">
                <label
                  htmlFor="workspace_name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Workspace Name
                </label>
                <input
                  type="text"
                  id="workspace_name"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter workspace name"
                  required
                  disabled={createWorkspaceMutation.isLoading}
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setWorkspaceName("");
                  }}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  disabled={createWorkspaceMutation.isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  disabled={createWorkspaceMutation.isLoading}
                >
                  {createWorkspaceMutation.isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Creating...
                    </>
                  ) : (
                    "Create"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Workspace Modal - Center Screen */}
      {showEditModal && editingWorkspace && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-gray-100 w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b">
              <h5 className="text-lg font-semibold text-gray-900">
                Edit Workspace
              </h5>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingWorkspace(null);
                  setEditWorkspaceName("");
                }}
                className="text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg p-1.5 transition-colors"
                disabled={updateWorkspaceMutation.isLoading}
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleUpdateWorkspace} className="p-6">
              <div className="mb-4">
                <label
                  htmlFor="edit_workspace_name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Workspace Name
                </label>
                <input
                  type="text"
                  id="edit_workspace_name"
                  value={editWorkspaceName}
                  onChange={(e) => setEditWorkspaceName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter workspace name"
                  required
                  disabled={updateWorkspaceMutation.isLoading}
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingWorkspace(null);
                    setEditWorkspaceName("");
                  }}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  disabled={updateWorkspaceMutation.isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  disabled={updateWorkspaceMutation.isLoading}
                >
                  {updateWorkspaceMutation.isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Updating...
                    </>
                  ) : (
                    "Update"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
