import React from "react";
import { Headphones } from "lucide-react";
import NavbarWithSidebar from "../../components/NavbarWithSidebar";

export default function AudioAssets() {
  return (
    <>
      <NavbarWithSidebar />
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Headphones size={24} className="text-orange-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Audio Assets</h1>
              <p className="text-gray-600">Manage your audio assets</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="text-center">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Headphones size={32} className="text-gray-400" />
              </div>
              <h2 className="text-xl font-medium text-gray-900 mb-2">
                Audio Assets Coming Soon
              </h2>
              <p className="text-gray-500">
                This page will contain all your audio management features.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
