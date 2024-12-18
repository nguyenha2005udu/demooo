import React, { useState, useEffect } from "react";
import memberService from "../../../services/admin/memberService";
import { toast } from "react-toastify";

const EditReaderForm = ({ reader, onClose, onUpdate }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (reader) {
      setName(reader.name);
      setEmail(reader.email);
      setAddress(reader.address);
      setPhoneNumber(reader.phoneNumber);
    }
  }, [reader]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
  
    const updatedReader = { id: reader.memberId, name, email, address, phoneNumber };
  
    try {
      const result = await memberService.updateMember(reader.memberId, updatedReader);
      onUpdate(result); // Cập nhật dữ liệu trong Redux Store
      onClose(); 
      toast.success("Cập nhật độc giả thành công!")
    } catch (err) {
      setError("Có lỗi xảy ra khi cập nhật. Vui lòng thử lại.");
      toast.error("Cập nhật độc giả thất bại!")
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-6 bg-white rounded-lg shadow-lg"
    >
      <div>
        <label className="block font-medium text-gray-700">Tên:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      <div>
        <label className="block font-medium text-gray-700">Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      <div>
        <label className="block font-medium text-gray-700">Địa Chỉ:</label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      <div>
        <label className="block font-medium text-gray-700">Số Điện Thoại:</label>
        <input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}
      <div className="flex gap-4 mt-6">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isLoading ? "Đang lưu..." : "Lưu"}
        </button>
      </div>
    </form>
  );
};

export default EditReaderForm;
