import React, { useState } from "react";
import {
  Menu,
  X,
  Users,
  ShoppingBag,
  Inbox,
  LayoutDashboard,
  LogIn,
  UserPlus,
} from "lucide-react";

export default function NavbarWithSidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      href: "#dashboard",
      badge: null,
    },
    { name: "Users", icon: Users, href: "#users", badge: null },
    { name: "Products", icon: ShoppingBag, href: "#products", badge: null },
    { name: "Inbox", icon: Inbox, href: "#inbox", badge: "3" },
    { name: "Sign In", icon: LogIn, href: "#signin", badge: null },
    { name: "Sign Up", icon: UserPlus, href: "#signup", badge: null },
  ];

  return (
    <>
      {/* Navbar */}
      <nav className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50 ">
        <div className=" px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-12">
            {/* Menu Button + Logo */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="text-gray-600 hover:text-gray-900 focus:outline-none transition-colors"
              >
                <Menu size={24} />
              </button>
              <span className="text-xl font-semibold text-gray-800">Logo</span>
            </div>

            {/* Right side content */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Welcome</span>
            </div>
          </div>
        </div>
      </nav>
      <div className="h-12">
      </div>

      {/* Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-900/50 z-40 transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-50 w-64 h-screen bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
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

        {/* Sidebar Menu */}
        <div className="py-4 overflow-y-auto h-full">
          <ul className="space-y-2 px-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group transition-colors"
                    onClick={() => setIsSidebarOpen(false)}
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
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
}
