import React, { useState } from "react";
import { FolderPlus, Plus, Trash2, Edit, X } from "lucide-react";
import { useWorkspaces, useCreateWorkspace, useDeleteWorkspace, useUpdateWorkspace } from "../hook/useWorkspace";

export default function Workspace({ show, setShow, navigate }) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("");
  const [editingWorkspace, setEditingWorkspace] = useState(null);
  const [editWorkspaceName, setEditWorkspaceName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [targetWorkspace, setTargetWorkspace] = useState(null);

  const { data: workspaces = [], isLoading, refetch } = useWorkspaces();
  const createWorkspaceMutation = useCreateWorkspace();
  const deleteWorkspaceMutation = useDeleteWorkspace();
  const updateWorkspaceMutation = useUpdateWorkspace();

  const handleAddWorkspace = () => {
    setShowCreateModal(true);
  };

  const handleCreateWorkspace = async (e) => {
    e.preventDefault();
    if (!workspaceName.trim()) return;

    const userData2 = JSON.parse(localStorage.getItem("user_data2") || "{}");
    if (!userData2 || !userData2.user_id) {
      alert("Please login first");
      return;
    }

    try {
      await createWorkspaceMutation.mutateAsync({
        workspace_name: workspaceName,
        user_id: userData2.user_id,
      });
      await refetch();
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
    if (!editWorkspaceName.trim()) return;

    try {
      await updateWorkspaceMutation.mutateAsync({
        workspaceId: editingWorkspace.workspace_id,
        workspaceName: editWorkspaceName,
      });
      await refetch();
      setEditingWorkspace(null);
      setEditWorkspaceName("");
      setShowEditModal(false);
    } catch (error) {
      console.error("Failed to update workspace:", error);
      alert("Failed to update workspace. Please try again.");
    }
  };

  const confirmDelete = async () => {
    await deleteWorkspaceMutation.mutateAsync(targetWorkspace.id);
    setShowModal(false);
    setConfirmText("");
    setTargetWorkspace(null);
  };

  const handleWorkspaceClick = (workspace) => {
    localStorage.setItem("workspace_id", workspace.workspace_id);
    localStorage.setItem("workspace_name", workspace.workspace_name);
    window.dispatchEvent(
      new CustomEvent("workspaceChanged", {
        detail: {
          workspace_id: workspace.workspace_id,
          workspace_name: workspace.workspace_name,
        },
      })
    );
    setShow(false);
    navigate("/");
  };

  return (
    <>
      {show && (
        <div
          className="fixed inset-0 bg-gray-900/30 z-40 transition-opacity"
          onClick={() => setShow(false)}
        />
      )}

      {show && (
        <div
          className="fixed top-14 left-1/2 -translate-x-1/2 md:left-[260px] md:translate-x-0 z-50 w-80 bg-white rounded-xl shadow-xl border border-gray-100 transition-all duration-300 ease-in-out"
        >
          <div className="flex items-center justify-between p-4 border-b">
            <h5 className="text-base font-semibold text-gray-600 uppercase">
              my work space
            </h5>
            <button
              onClick={() => setShow(false)}
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
                    className="flex items-center gap-2 p-3 hover:bg-gray-50 rounded-lg transition-colors group cursor-pointer"
                    onClick={() => handleWorkspaceClick(ws)}
                  >
                    <FolderPlus size={18} className="text-gray-500 flex-shrink-0" />
                    <span className="text-gray-700 flex-1">{ws.workspace_name}</span>
                    {ws.user_id !== "global" && (
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
                            setTargetWorkspace({ id: ws.workspace_id, name: ws.workspace_name });
                            setShowModal(true);
                          }}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete workspace"
                          disabled={deleteWorkspaceMutation.isLoading}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
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

      {showModal && targetWorkspace && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-2">
              Delete “{targetWorkspace.name}”?
            </h2>
            <p className="text-sm text-gray-600 mb-3">
              พิมพ์ <strong>delete</strong> เพื่อยืนยันการลบ
            </p>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="w-full border rounded px-3 py-2 mb-4"
              placeholder="พิมพ์ delete ที่นี่"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-3 py-1.5 rounded border border-gray-300 hover:bg-gray-100"
              >
                ยกเลิก
              </button>
              <button
                onClick={confirmDelete}
                disabled={confirmText.trim().toLowerCase() !== "delete"}
                className={`px-3 py-1.5 rounded text-white ${confirmText.trim().toLowerCase() === "delete"
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-red-300 cursor-not-allowed"
                  }`}
              >
                ลบจริง
              </button>
            </div>
          </div>
        </div>
      )}

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
