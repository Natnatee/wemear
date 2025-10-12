import React from "react";

const CardImage = ({ mindFile }) => {
  if (!mindFile) return null;

  const tracks = Object.keys(mindFile.image).filter(key => key.startsWith('image_'));

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {tracks.map((trackKey, index) => (
        <div
          key={trackKey}
          className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
        >
          <img
            src={mindFile.image[trackKey]}
            alt={`${trackKey}`}
            className="w-full h-32 object-cover rounded-t-lg"
          />
          <div className="p-3 text-center">
            <span className="text-sm font-medium text-gray-700">
              Track {index + 1}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardImage;
