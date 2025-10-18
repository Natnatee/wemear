import React, { useState } from "react";
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
} from "lucide-react";
import { workspace } from "../make_data/workspace";

export default function NavbarWithSidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [workspaces, setWorkspaces] = useState(workspace);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleAddWorkspace = () => {
    const newWorkspace = {
      workspace_id: String(workspaces.length + 1),
      user_id: '1',
      share_user_id: [],
      name: `New Workspace ${workspaces.length + 1}`
    };
    setWorkspaces([...workspaces, newWorkspace]);
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
    { name: "Sign Up", icon: UserPlus, href: "/register", badge: null }, // เปลี่ยนเป็น link ไปหน้า register
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
              <span className="text-xl font-semibold text-gray-800">Logo</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Welcome</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 px-2 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
              >
                <LogOut size={14} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <div className="h-12"></div>

      {/* Backdrop */}
      {(isSidebarOpen || activeModal) && (
        <div
          className="fixed inset-0 bg-gray-900/30 z-40 transition-opacity"
          onClick={() => {
            setIsSidebarOpen(false);
            setActiveModal(null);
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
                  {item.href && item.href.startsWith('/') ? (
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

      {/* Floating Modal (ชิดขวา sidebar) */}
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
            {workspaces.map((ws) => (
              <div
                key={ws.workspace_id}
                className="flex items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
              >
                <FolderPlus size={18} className="text-gray-500 mr-3" />
                <span className="text-gray-700">{ws.name}</span>
              </div>
            ))}
            <button
              onClick={handleAddWorkspace}
              className="w-full flex items-center justify-center p-3 mt-4 text-blue-600 hover:bg-blue-50 rounded-lg border-2 border-dashed border-blue-200 hover:border-blue-300 transition-colors"
            >
              <Plus size={18} className="mr-2" />
              New Workspace
            </button>
          </div>
        </div>
      )}
    </>
  );
}
