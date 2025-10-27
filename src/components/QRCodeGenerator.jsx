import React, { useState } from "react";
import QRCodeLib from "qrcode";
import { saveAs } from "file-saver";

const QRCodeGenerator = ({ link }) => {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const generateQRCode = async () => {
    if (!link) return;

    setIsGenerating(true);
    try {
      // Add https:// if the link doesn't have a protocol
      let formattedLink = link.trim();
      if (!formattedLink.match(/^https?:\/\//i)) {
        formattedLink = "https://" + formattedLink;
      }

      const dataUrl = await QRCodeLib.toDataURL(formattedLink, {
        width: 200,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });
      setQrCodeDataUrl(dataUrl);
    } catch (error) {
      console.error("Error generating QR code:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadQRCode = () => {
    if (!qrCodeDataUrl) return;

    const fileName = `qr-code-${Date.now()}.png`;
    saveAs(qrCodeDataUrl, fileName);
  };

  // Generate QR code automatically when component mounts or link changes
  React.useEffect(() => {
    if (link) {
      generateQRCode();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [link]);

  if (!link) {
    return (
      <div className="text-center p-4">
        <p className="text-gray-500">ไม่มีลิงก์สำหรับสร้าง QR Code</p>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 max-w-lg mx-auto">
      {/* QR Code Section */}
      <div className="bg-white p-3 rounded-lg shadow-md flex-shrink-0">
        {isGenerating ? (
          <div className="flex items-center justify-center w-48 h-48">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        ) : qrCodeDataUrl ? (
          <img
            src={qrCodeDataUrl}
            alt="QR Code"
            className="w-48 h-48 object-contain"
          />
        ) : null}
      </div>

      {/* Link and Download Section */}
      <div className="flex-1 min-w-0">
        <div className="bg-gray-50 p-3 rounded-lg h-full flex flex-col justify-between">
          <div className="mb-2">
            <p className="text-sm text-gray-600 break-all">{link}</p>
          </div>
          <div className="flex justify-end">
            <button
              onClick={downloadQRCode}
              disabled={!qrCodeDataUrl}
              className="p-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
              title="ดาวน์โหลด QR Code"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7,10 12,15 17,10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeGenerator;
