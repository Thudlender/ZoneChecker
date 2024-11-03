import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuthContext } from '../context/AuthContext';
import StoreService from '../service/store.service';

// ฟังก์ชันแปลง DMS เป็น Decimal (สำหรับการแปลง DMS ถ้าจำเป็น)
const dmsToDecimal = (dms) => {
  const regex = /(\d+)[° ](\d+)[\' ](\d+(?:\.\d+)?)[\" ]([NSEW])/i;
  const match = dms.match(regex);

  if (!match) return null;

  const [_, degrees, minutes, seconds, direction] = match;
  let decimal = parseFloat(degrees) + parseFloat(minutes) / 60 + parseFloat(seconds) / 3600;

  if (['S', 'W'].includes(direction.toUpperCase())) {
    decimal *= -1;
  }

  return decimal;
};

const AddLocation = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const [storeData, setStoreData] = useState({
    storeName: '',
    address: '',
    lat: 13.82199291,
    lng: 100.0541448,
    deliveryRadius: '',
    dms: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // ตรวจสอบว่าเป็นฟิลด์ Delivery Radius และค่าที่กรอกไม่ใช่ค่าติดลบ
    if (name === "deliveryRadius" && value < 0) {
      Swal.fire({
        icon: "error",
        title: "ค่าต้องไม่ติดลบ",
        text: "กรุณากรอกจำนวนที่ไม่ติดลบ",
      });
      return; // หยุดการทำงาน หากค่าเป็นค่าติดลบ
    }
    setStoreData({ ...storeData, [e.target.name]: e.target.value });
  };

  // ฟังก์ชันแปลงเมื่อกดปุ่ม Format
  const handleFormatDMS = () => {
    if (!storeData.dms) {
      Swal.fire('แจ้งเตือน', 'กรุณากรอกพิกัด DMS ก่อน', 'warning');
      return;
    }

    // แยกค่าพิกัด Latitude และ Longitude
    const dmsArray = storeData.dms.split(',');
    
    // ตรวจสอบว่ามีค่ามากกว่าหรือเท่ากับ 2
    if (dmsArray.length < 2) {
      Swal.fire('เกิดข้อผิดพลาด', 'กรุณากรอกพิกัด DMS ให้ครบ', 'error');
      return;
    }

    // ลบช่องว่างออกจากพิกัด
    const latValue = dmsArray[0].trim();
    const lngValue = dmsArray[1].trim();

    // ตรวจสอบว่าค่าพิกัดอยู่ในรูปแบบที่ถูกต้องหรือไม่
    if (!isNaN(latValue) && !isNaN(lngValue)) {
      const lat = parseFloat(latValue);
      const lng = parseFloat(lngValue);

      // กำหนดค่าให้กับ latitude และ longitude
      setStoreData((prev) => ({ ...prev, lat, lng }));
    } else {
      Swal.fire('เกิดข้อผิดพลาด', 'พิกัดไม่ถูกต้อง โปรดลองใหม่อีกครั้ง', 'error');
    }
  };

  const handleSubmit = async (e) => {
    
    e.preventDefault();
    
  if (storeData.deliveryRadius <= 0) {
    Swal.fire({
      icon: 'error',
      title: 'ค่ารัศมีการจัดส่งต้องมากกว่า 0',
      text: 'กรุณากรอกค่าที่มากกว่า 0 สำหรับรัศมีการจัดส่ง',
      timer: 2000,
    });
    return; 
  }
    const newStore = { ...storeData, adminId: user.id };

    try {
      const response = await StoreService.addstore(newStore);
      
      if (response.status === 200) {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'ยินดีด้วย คุณเพิ่มข้อมูลร้านสำเร็จ',
          text: response.data.message,
          timer: 2000,
        }).then(() => {
          setStoreData({
            storeName: '',
            address: '',
            lat: 13.82199291,
            lng: 100.0541448,
            deliveryRadius: '',
            dms: '',
          });
          navigate('/');
        });
      }
    } catch (error) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: error?.response?.data?.message || 'ไม่สามารถเพิ่มสถานที่ได้',
        timer: 2000,
      });
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md mt-10">
      <h2 className="text-2xl font-bold mb-6">Add New Location</h2>
      <form onSubmit={handleSubmit}>
        {/* Store Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Store Name</label>
          <input
            type="text"
            name="storeName"
            value={storeData.storeName}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
        </div>

        {/* Address */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Address</label>
          <textarea
            name="address"
            value={storeData.address}
            onChange={handleChange}
            className="textarea textarea-bordered w-full"
            required
          />
        </div>

        {/* DMS Input */}
        <div className="mb-4 flex items-center gap-2">
          <div className="flex-grow">
            <label className="block text-sm font-medium mb-1">Latitude & Longitude</label>
            <input
              type="text"
              name="dms"
              value={storeData.dms}
              onChange={handleChange}
              placeholder='เช่น 13.835683602805053, 100.02766429173145'
              className="input input-bordered w-full placeholder-gray-500"
            />
          </div>
          <button
            type="button"
            onClick={handleFormatDMS}
            className="btn btn-secondary mt-5"
          >
            Format
          </button>
        </div>

        {/* Latitude */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Latitude</label>
          <input
            type="number"
            step="any"
            name="lat"
            value={storeData.lat}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
        </div>

        {/* Longitude */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Longitude</label>
          <input
            type="number"
            step="any"
            name="lng"
            value={storeData.lng}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
        </div>

        {/* Delivery Radius */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Delivery Radius (meters)</label>
          <input
            type="number"
            name="deliveryRadius"
            value={storeData.deliveryRadius}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn btn-primary w-full">
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddLocation;