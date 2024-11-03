import React, { useState } from "react";
import EditModal from "./EditModal"; // Modal component for editing
import { useAuthContext } from "../context/AuthContext";
import Swal from "sweetalert2";
import StoreService from "../service/store.service";

const RowEdit = ({ storeID, storeName, adminId, address, lat, lng, deliveryRadius }) => {
  console.log("storeName:", storeName);

  const { user } = useAuthContext();

  // State to control modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handle opening and closing the modal
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Handle store deletion
  const handleDeleteStore = async (storeID) => {
    Swal.fire({
      title: "ยืนยันการลบข้อมูลร้าน?",
      text: "คุณแน่ใจว่าตัดสินใจดีแล้ว",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "แน่นอน, ฉันจะลบ!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await StoreService.deletestore(storeID);
          if (response.status === 200) {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "ลบทิ้งไปแล้ว!",
              text: "ลบเรียบร้อยแล้ว!",
              timer: 7000,
            }).then(() => window.location.reload());
          }
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "ลบ ล้มเหลว!",
            text: `ไม่สามารถยืนยันการลบได้! เนื่องจากคุณไม่ได้เป็นเจ้าของ ${error.message}`,
          });
        }
      }
    });
  };
  const isOwner = user && adminId === user.id;
  return (
    <div
      tabIndex={0}
      className="collapse collapse-close border border-base-300 bg-base-200 rounded-lg p-4 shadow-md mb-4"
    >
      <div className="flex justify-between items-center">
        {/* Store Details */}
        <div>
          <p className="text-lg font-semibold">{storeName}</p>
          <p className="text-sm text-gray-500">Admin ID: {adminId}</p>
          <p className="text-sm text-gray-500">{address}</p>
          <p className="text-sm text-gray-500">
            Lat: {lat}, Lng: {lng}
          </p>
          <p className="text-sm text-gray-500">
            Delivery Radius: {deliveryRadius} km
          </p>
          {/*แสดงให้รู้ว่าใครเป็นเจ้าของ */}
          {isOwner && (
            <div className="bg-green-100 text-green-800 rounded-full px-4 w-44 border-spacing-1 mt-1">
              คุณเป็นเจ้าของร้านนี้!
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {user && user.roles.includes("ROLE_ADMIN") && user.id === adminId && (
          <div className="flex space-x-2">
            {/* Open Modal on Click */}
            <button
              onClick={openModal}
              className="text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md text-sm shadow-md"
            >
              แก้ไข
            </button>

            <button
              onClick={() => handleDeleteStore(storeID)}
              className="text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md text-sm shadow-md"
            >
              ลบ
            </button>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <EditModal
          isOpen={isModalOpen}
          onClose={closeModal}
          storeID={storeID}
          storeName={storeName}
          address={address}
          lat={lat}
          lng={lng}
          deliveryRadius={deliveryRadius}
        />
      )}

      

      <div className="collapse-content mt-2">
        <p className="text-gray-500">
          tabindex={0} attribute is necessary to make the div focusable
        </p>
      </div>
    </div>
  );
};

export default RowEdit;