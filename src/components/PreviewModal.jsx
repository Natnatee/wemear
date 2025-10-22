import React from "react";
import { X } from "lucide-react";

export default function PreviewModal({ isOpen, onClose, imageUrls }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            Preview - Compiled Images
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {imageUrls && imageUrls.length > 0 ? (
            <div className="space-y-6">
              {imageUrls.map((imageUrl, index) => (
                <div key={index} className="border rounded-lg p-4 bg-gray-50">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Image {index + 1}
                  </h3>
                  <div className="bg-white rounded border overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={`Compiled ${index + 1}`}
                      className="w-full h-auto"
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500">ไม่มีข้อมูลที่จะแสดง</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
}
