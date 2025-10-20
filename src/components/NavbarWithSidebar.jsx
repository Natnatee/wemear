import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LayoutDashboard, LogIn, UserPlus, LogOut, FolderOpen, Image, Video, Box, Headphones, FileText } from "lucide-react";
import Workspace from "./Workspace";

export default function NavbarWithSidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [show, setShow] = useState(false);
  const [showAssetsModal, setShowAssetsModal] = useState(false);
  const [userData2, setUserData2] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData2String = localStorage.getItem("user_data2");
    const userDataString = localStorage.getItem("user_data");

    if (userData2String) {
      try {
        setUserData2(JSON.parse(userData2String));
      } catch (error) {
        console.error("Failed to parse user_data2:", error);
      }
    } else if (userDataString) {
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

  const menuItems = [
    { name: "Project", icon: LayoutDashboard, type: "modal", badge: null },
    { name: "Assets", icon: FolderOpen, type: "assets_modal", badge: null },
    { name: "Sign In", icon: LogIn, href: "/login", badge: null },
    { name: "Sign Up", icon: UserPlus, href: "/register", badge: null },
  ];

  const handleItemClick = (item) => {
    if (item.type === "modal") {
      setShow(true);
    } else if (item.type === "assets_modal") {
      setShowAssetsModal(true);
    } else {
      setIsSidebarOpen(false);
    }
  };

  const assetsMenuItems = [
    { name: "Image", icon: Image, href: "/assets/image" },
    { name: "Video", icon: Video, href: "/assets/video" },
    { name: "3D", icon: Box, href: "/assets/3d" },
    { name: "Audio", icon: Headphones, href: "/assets/audio" },
    { name: "Mind File", icon: FileText, href: "/assets/mindfile" },
  ];

  return (
    <>
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

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-900/30 z-40 transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 left-0 z-50 w-64 h-screen bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h5 className="text-base font-semibold text-gray-500 uppercase">
            Menu
          </h5>
          <button
            onClick={() => setIsSidebarOpen(false)}
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

      <Workspace show={show} setShow={setShow} navigate={navigate} />

      {/* Assets Modal */}
      {showAssetsModal && (
        <div
          className="fixed inset-0 bg-gray-900/30 z-50 transition-opacity"
          onClick={() => setShowAssetsModal(false)}
        >
          <div
            className="fixed top-16 left-4 w-64 bg-white shadow-lg rounded-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h5 className="text-base font-semibold text-gray-700">
                Assets
              </h5>
              <button
                onClick={() => setShowAssetsModal(false)}
                className="text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg p-1.5 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="py-2">
              <ul className="space-y-1 px-3">
                {assetsMenuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        onClick={() => {
                          setShowAssetsModal(false);
                          setIsSidebarOpen(false);
                        }}
                        className="w-full flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group transition-colors text-left"
                      >
                        <Icon
                          size={18}
                          className="text-gray-500 group-hover:text-gray-900 transition-colors"
                        />
                        <span className="flex-1 ml-3 whitespace-nowrap text-sm">
                          {item.name}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
