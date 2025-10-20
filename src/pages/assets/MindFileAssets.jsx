import React from "react";
import { FileText } from "lucide-react";
import NavbarWithSidebar from "../../components/NavbarWithSidebar";

export default function MindFileAssets() {
  return (
    <>
      <NavbarWithSidebar />
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-indigo-100 rounded-lg">
              <FileText size={24} className="text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mind File Assets</h1>
              <p className="text-gray-600">Manage your mind map and file assets</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="text-center">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FileText size={32} className="text-gray-400" />
              </div>
              <h2 className="text-xl font-medium text-gray-900 mb-2">
                Mind File Assets Coming Soon
              </h2>
              <p className="text-gray-500">
                This page will contain all your mind map and document management features.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
