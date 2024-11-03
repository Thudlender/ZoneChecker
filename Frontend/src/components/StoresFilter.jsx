import { useState } from "react";

const StoreFilter = ({ stores, setFilteredStores }) => {
  const [keyword, setKeyword] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setKeyword(value);

    if (value === "") {
      setFilteredStores(stores); // รีเซ็ตข้อมูลเมื่อไม่มีคีย์เวิร์ด
      return;
    }

    // ฟิลเตอร์ตามชื่อร้านหรือที่อยู่ (ปรับให้ตรงกับข้อมูลจริง)
    const result = stores.filter((store) =>
      store.storeName.toLowerCase().includes(value.toLowerCase()) ||
      store.address.toLowerCase().includes(value.toLowerCase())
    );

    console.log("ผลลัพธ์การค้นหา:", result);
    setFilteredStores(result);
  };

  return (
    <div className="py-6 w-full lg:max-w-screen-2xl mx-auto ml-5">
      <div className="flex items-center bg-white border border-gray-300 rounded-full shadow-md overflow-hidden max-w-4xl">
        <input
          type="text"
          placeholder="ค้นหาชื่อร้านหรือที่อยู่..."
          className="w-full px-4 py-3 text-gray-700 text-sm outline-none bg-transparent focus:ring-2 focus:ring-blue-400 transition duration-200"
          onChange={handleChange}
          value={keyword}
        />
        <button
          type="button"
          className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white px-5 py-3 rounded-full transition duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 192.904 192.904"
            width="18px"
            className="fill-current"
          >
            <path d="m190.707 180.101-47.078-47.077c11.702-14.072 18.752-32.142 18.752-51.831C162.381 36.423 125.959 0 81.191 0 36.422 0 0 36.423 0 81.193c0 44.767 36.422 81.187 81.191 81.187 19.688 0 37.759-7.049 51.831-18.751l47.079 47.078a7.474 7.474 0 0 0 5.303 2.197 7.498 7.498 0 0 0 5.303-12.803zM15 81.193C15 44.694 44.693 15 81.191 15c36.497 0 66.189 29.694 66.189 66.193 0 36.496-29.692 66.187-66.189 66.187C44.693 147.38 15 117.689 15 81.193z"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default StoreFilter;