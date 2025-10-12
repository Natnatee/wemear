import React, { useState } from "react";
import { useParams } from "react-router-dom";
import NavbarWithSidebar from "../components/NavbarWithSidebar";
import CardImage from "../components/CardImage";
import QRCodeGenerator from "../components/QRCodeGenerator";
import { sampleProjects } from "../make_data/sample_project";
import { make_mind_ar } from "../make_data/make_mind_ar_3.js";

function Project() {
  const { id } = useParams();

  // ค้นหา project ที่ตรงกับ id ที่ได้รับจาก sampleProjects data
  const project = sampleProjects.find((p) => p.project_id === id);

  // ค้นหา mind_ar data เพิ่มเติมถ้าต้องการแสดง CardImage
  const mindArData = make_mind_ar.find((p) => p.id === id);

  // State สำหรับเก็บค่าที่แก้ไขได้
  const [editedProject, setEditedProject] = useState({
    name: project?.name || "",
    label: project?.label || ""
  });

  const handleInputChange = (field, value) => {
    setEditedProject(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // ที่นี่จะเป็นการบันทึกข้อมูล (ในที่นี้จะเป็นแค่ console.log)
    console.log("บันทึกข้อมูล:", editedProject);
    // ในอนาคตอาจจะส่งไป API หรืออัปเดต state กลาง
    alert("บันทึกข้อมูลเรียบร้อยแล้ว!");
  };

  if (!project) {
    return (
      <>
        <NavbarWithSidebar />
        <div className="container mx-auto p-4">
          <div className="text-center py-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              ไม่พบโปรเจค
            </h1>
            <p className="text-gray-600">
              ไม่พบโปรเจคที่คุณกำลังมองหา (ID: {id})
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <NavbarWithSidebar />
      <div className="container mx-auto p-4">
        <div className="max-w-6xl mx-auto">
          {/* ส่วนบน - แยกซ้ายขวา */}
          <div className="flex flex-col lg:flex-row gap-8 mb-8">
            {/* ซ้าย - รูปภาพ */}
            <div className="lg:w-1/2 flex items-center justify-center">
              <img
                src={project.image}
                alt={project.name}
                className="w-full h-64 lg:h-80 object-cover rounded-lg shadow-md"
              />
            </div>

            {/* ขวา - รายละเอียดโปรเจค */}
            <div className="lg:w-1/2 relative">
              <div className="bg-gray-50 rounded-lg p-6 h-full">
                <h2 className="text-xl font-semibold mb-4">รายละเอียดโปรเจค</h2>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-gray-700">ชื่อโปรเจค:</span>
                    <input
                      type="text"
                      value={editedProject.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="ml-2 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="ใส่ชื่อโปรเจค"
                    />
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Label:</span>
                    <input
                      type="text"
                      value={editedProject.label}
                      onChange={(e) => handleInputChange('label', e.target.value)}
                      className="ml-2 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="ใส่ label"
                    />
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Owner:</span>
                    <span className="ml-2">{project.owner}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">วันที่สร้าง:</span>
                    <span className="ml-2">{project.date}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">สถานะ:</span>
                    <span className={`ml-2 px-2 py-1 rounded text-sm ${
                      project.status === 'Published'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Tool:</span>
                    <span className="ml-2">{project.tool}</span>
                  </div>
                </div>

                {/* ปุ่ม Save ที่มุมขวาล่าง */}
                <div className="absolute bottom-4 right-4">
                  <button
                    onClick={handleSave}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ส่วนล่าง - แสดง CardImage ถ้ามี mind_ar data */}
          {mindArData && mindArData.mindFile && (
            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
                Image Tracking Cards
              </h2>
              <CardImage mindFile={mindArData.mindFile} />
            </div>
          )}

          {/* ส่วน QR Code */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <QRCodeGenerator link={project.link} />
          </div>
        </div>
      </div>
    </>
  );
}

export default Project;
