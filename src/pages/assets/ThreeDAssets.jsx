import React from "react";
import { Box } from "lucide-react";
import NavbarWithSidebar from "../../components/NavbarWithSidebar";

export default function ThreeDAssets() {
  return (
    <>
      <NavbarWithSidebar />
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-green-100 rounded-lg">
              <Box size={24} className="text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">3D Assets</h1>
              <p className="text-gray-600">Manage your 3D models and assets</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="text-center">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Box size={32} className="text-gray-400" />
              </div>
              <h2 className="text-xl font-medium text-gray-900 mb-2">
                3D Assets Coming Soon
              </h2>
              <p className="text-gray-500">
                This page will contain all your 3D model management features.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
