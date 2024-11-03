import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import StoreService from '../service/store.service';

const EditLocation = () => {
  const navigate = useNavigate();
  const { storeID } = useParams(); // ใช้ storeID แทน locationID
  const [locationData, setLocationData] = useState({
    storeName: '',
    address: '',
    lat: '',
    lng: '',
    deliveryRadius: '',
  });

  // Get Location By ID
  useEffect(() => {
    StoreService.getstoreById(storeID).then((response) => {
      if (response.status === 200) {
        setLocationData(response.data);
      }
    });
  }, [storeID]);

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
    setLocationData({ ...locationData, [e.target.name]: e.target.value });
  };

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
      const response = await StoreService.updatestore(storeID, locationData); // ส่ง storeID
      if (response.status === 200) {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'แก้ไขข้อมูลสถานที่สำเร็จ',
          text: response.data.message,
          timer: 2000
        });
        navigate('/'); // กลับไปหน้าแรกหลังจากบันทึก
      }
    } catch (error) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: error?.response?.data?.message || error.message,
        timer: 2000
      });
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md mt-10">
      <h2 className="text-2xl font-bold mb-6">Edit Location</h2>
      <form onSubmit={handleSubmit}>
        {/* Store Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Store Name</label>
          <input
            type="text"
            name="storeName"
            value={locationData.storeName}
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
            value={locationData.address}
            onChange={handleChange}
            className="textarea textarea-bordered w-full"
            required
          />
        </div>

        {/* Latitude */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Latitude</label>
          <input
            type="number"
            step="any"
            name="lat"
            value={locationData.lat}
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
            value={locationData.lng}
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
            value={locationData.deliveryRadius}
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

export default EditLocation;