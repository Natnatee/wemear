function ProjectUi() {
  return (
    <div className="h-full flex gap-6 overflow-hidden">
      {/* ส่วนซ้าย - แสดงโทรศัพท์ */}
      <div className="w-1/3 flex flex-col items-center justify-center overflow-hidden">
        <h3 className="text-lg font-semibold mb-6">Project preloader</h3>

        {/* Phone mockup - Modern iPhone style */}
        <div className="relative w-52 h-[550px] bg-gradient-to-br from-gray-900 to-black rounded-[3rem] p-3 shadow-2xl">
          {/* Phone notch - sleeker design */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-4 bg-black rounded-b-3xl z-10 flex items-center justify-center">
            <div className="w-20 h-1 bg-gray-800 rounded-full mt-2"></div>
          </div>

          {/* Phone screen - with image preview mockup */}
          <div className="relative w-full h-full bg-white rounded-[2rem] overflow-hidden shadow-inner">
            {/* Mock background image - cover the whole screen */}
            <img
              src="/color_theme.jpg"
              alt="Background Preview"
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Mock logo in center */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/90 flex items-center justify-center rounded-xl">
                <img
                  src="/weme_ar_shadow.jpg"
                  alt="Logo Preview"
                  className="w-20 h-20 rounded-xl"
                />
              </div>
            </div>

            {/* Mock Download*/}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/90 px-4 py-2 rounded-full shadow-md text-center text-sm font-semibold">
              Downloading... 50%
            </div>
          </div>

          {/* Home indicator - iOS style */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1.5 bg-gray-700 rounded-full"></div>
        </div>
      </div>

      {/* ส่วนขวา - Background & Logo */}
      <div className="flex-1 flex flex-col gap-6 overflow-y-auto overflow-x-hidden">
        <h3 className="text-lg font-semibold">Background</h3>

        {/* Background section */}
        <div className="flex-shrink-0">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Background Image
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition cursor-pointer">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <button className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                Change background
              </button>
              <p className="text-xs text-gray-400 mt-2">
                Recommended: JPG, 1080x1920 PX
              </p>
            </div>
          </div>
        </div>

        {/* Logo section */}
        <div className="flex-shrink-0">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Logo
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition cursor-pointer">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <button className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                Change photo
              </button>
              <p className="text-xs text-gray-400 mt-2">
                Recommended: JPG, 525x525 PX
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectUi;
