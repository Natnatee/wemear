import React, { useState } from 'react';

const ToolAssets = ({ currentState }) => {
  const [selectedAssetType, setSelectedAssetType] = useState('Image');

  const buttonClasses = (type) => (
    `px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ` +
    (selectedAssetType === type
      ? `bg-blue-500 text-white shadow-lg transform scale-105`
      : `bg-gray-200 text-gray-700 hover:bg-gray-300`)
  );

  const handleButtonClick = (type) => {
    setSelectedAssetType(type);
    console.log('Selected Asset Type:', type);
    console.log('Current State:', currentState);
  };

  return (
    <div className="absolute left-4 top-1/2 -translate-y-1/2 bg-white p-4 rounded-xl shadow-lg flex flex-col items-center space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Assets</h3>
      <div className="flex flex-col space-y-2">
        <button
          className={buttonClasses('Image')}
          onClick={() => handleButtonClick('Image')}
        >
          Image
        </button>
        <button
          className={buttonClasses('Video')}
          onClick={() => handleButtonClick('Video')}
        >
          Video
        </button>
        <button
          className={buttonClasses('3D')}
          onClick={() => handleButtonClick('3D')}
        >
          3D
        </button>
      </div>
    </div>
  );
};

export default ToolAssets;