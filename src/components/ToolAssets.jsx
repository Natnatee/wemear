import React, { useState } from 'react';

const ToolAssets = () => {
  const [selectedAssetType, setSelectedAssetType] = useState('Image');

  const buttonClasses = (type) => (
    `px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ` +
    (selectedAssetType === type
      ? `bg-blue-500 text-white shadow-lg transform scale-105`
      : `bg-gray-200 text-gray-700 hover:bg-gray-300`)
  );

  return (
    <div className="absolute left-4 top-1/2 -translate-y-1/2 bg-white p-4 rounded-xl shadow-lg flex flex-col items-center space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Assets</h3>
      <div className="flex flex-col space-y-2">
        <button
          className={buttonClasses('Image')}
          onClick={() => setSelectedAssetType('Image')}
        >
          Image
        </button>
        <button
          className={buttonClasses('Video')}
          onClick={() => setSelectedAssetType('Video')}
        >
          Video
        </button>
        <button
          className={buttonClasses('3D')}
          onClick={() => setSelectedAssetType('3D')}
        >
          3D
        </button>
      </div>
    </div>
  );
};

export default ToolAssets;