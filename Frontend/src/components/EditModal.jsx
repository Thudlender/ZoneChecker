import React, { useState } from "react";
import Swal from "sweetalert2";
import StoreService from "../service/store.service";
// ส่วนของการแก้ไขข้อมูลร้านค้า
const EditModal = ({
  isOpen,
  onClose,
  storeID,
  storeName: initialName,
  address: initialAddress,
  lat: initialLat,
  lng: initialLng,
  deliveryRadius: initialRadius,
}) => {
  // Combine all fields into one state object
  const [locationData, setLocationData] = useState({
    storeName: initialName,
    address: initialAddress,
    lat: initialLat,
    lng: initialLng,
    deliveryRadius: initialRadius,
  });

  // Handle input changes
  const handleChange = (e) => {
  
    const { name, value } = e.target;
    if (name === "deliveryRadius" && value < 0) {
      Swal.fire({
        icon: "error",
        title: "ค่าต้องไม่ติดลบ",
        text: "กรุณากรอกจำนวนที่ไม่ติดลบ",
      });
      return; // หยุดการทำงาน หากค่าเป็นค่าติดลบ
    }
    setLocationData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (locationData.deliveryRadius <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'ค่ารัศมีการจัดส่งต้องมากกว่า 0',
        text: 'กรุณากรอกค่าที่มากกว่า 0 สำหรับรัศมีการจัดส่ง',
        timer: 2000,
      });
      return; 
    }
    try {
      const response = await StoreService.updatestore(storeID, locationData);
      if (response.status === 200) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "แก้ไขข้อมูลสถานที่สำเร็จ",
          text: response.data.message,
          timer: 2000,
          showConfirmButton: false,
          backdrop: true,
          customClass: {
            popup: "swal-custom-popup",
          },
        }).then(() => {
          onClose();
          window.location.reload();
        });
      }
    } catch (error) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: error?.response?.data?.message || error.message,
        timer: 2000,
        showConfirmButton: false,
        backdrop: true,
        customClass: {
          popup: "swal-custom-popup",
        },
      });
    }
  };

  if (!isOpen) return null; // Don't render if modal is not open

  return (
    <>
       {/* สไตล์แบบ in-component */}
       <style>
       {`
         .swal-custom-popup {
           z-index: 10500 !important;
         }
       `}
     </style>
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1]" 
      // style={{ zIndex: 9999 }} z-[8888]
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
        <h2 className="text-xl font-semibold mb-4">แก้ไขข้อมูลร้าน</h2>

        <input
          type="text"
          name="storeName"
          value={locationData.storeName}
          onChange={handleChange}
          placeholder="ชื่อร้าน"
          className="input input-bordered w-full mb-2"
        />

        <textarea
          type="text"
          name="address"
          value={locationData.address}
          onChange={handleChange}
          placeholder="ที่อยู่"
          className="input input-bordered w-full mb-2"
        />

        <input
          type="number"
          name="lat"
          value={locationData.lat}
          onChange={handleChange}
          placeholder="ละติจูด"
          className="input input-bordered w-full mb-2"
        />

        <input
          type="number"
          name="lng"
          value={locationData.lng}
          onChange={handleChange}
          placeholder="ลองจิจูด"
          className="input input-bordered w-full mb-2"
        />

        <input
          type="number"
          name="deliveryRadius"
          value={locationData.deliveryRadius}
          onChange={handleChange}
          placeholder="รัศมีการจัดส่ง (กม.)"
          className="input input-bordered w-full mb-2"
        />

        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="btn btn-secondary">
            ยกเลิก
          </button>
          <button onClick={handleSubmit} className="btn btn-primary">
            บันทึก
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default EditModal;