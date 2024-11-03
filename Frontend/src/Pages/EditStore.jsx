import React, { useEffect, useState } from 'react';
import Stores from "../components/Stores";
import StoreService from '../service/store.service';
import StoreFilter from "../components/StoreFilter";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStore } from '@fortawesome/free-solid-svg-icons';


const EditStore = () => {
  const [stores, setStores] = useState([]); // ข้อมูลร้านค้าทั้งหมด
  const [filteredStores, setFilteredStores] = useState([]); // ข้อมูลร้านค้าที่ฟิลเตอร์

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await StoreService.getAllStore(); // ดึงข้อมูลจาก API
        if (response.status === 200) {
          setStores(response.data); // เก็บข้อมูลทั้งหมด
          setFilteredStores(response.data); // ตั้งค่าเริ่มต้นให้ฟิลเตอร์
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: error?.response?.data?.message || error.message,
          footer: '<a href="">ทำไมถึงเกิดปัญหานี้?</a>'
        });
      }
    };

    fetchStores(); // เรียกข้อมูลเมื่อ component โหลด
  }, []);

  return (
    <div className="p-4 min-h-screen flex flex-col items-center">
      <h3 className='text-2xl'>
        หน้า<span className="text-blue-500"> <FontAwesomeIcon icon={faStore} />แก้ไข </span>ข้อมูลร้านค้า
      </h3>
      {/* ส่วนของ Search Bar ให้อยู่ด้านบน */}
      <div className="w-full max-w-xl top-4 z-10">
        <StoreFilter stores={stores} setFilteredStores={setFilteredStores} />
      </div>
  
      {/* ส่วนแสดงผลลัพธ์ */}
      <div className="w-full max-w-4xl flex-grow">
        <Stores stores={filteredStores} />
      </div>
    </div>
  );
  
  
};

export default EditStore;