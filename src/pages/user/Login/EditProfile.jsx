import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditProfile = () => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    gender: '',
    birthDate: '',
    address: '',
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const memberId = localStorage.getItem('memberId');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`https://library-mana.azurewebsites.net/members/${memberId}`);
        setUserData({
          ...response.data,
          gender: '', 
          birthDate: '', 
          address: '', 
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setMessage('Không thể tải thông tin người dùng.');
        setLoading(false);
      }
    };

    fetchUserData();
  }, [memberId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `https://library-mana.azurewebsites.net/members/update/${memberId}`,
        userData
      );
      if (response.status === 200) {
        setMessage('Cập nhật hồ sơ thành công!');
        setTimeout(() => navigate('/'), 2000);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Cập nhật hồ sơ thất bại. Vui lòng thử lại.');
    }
  };

  if (loading) {
    return <div>Đang tải dữ liệu...</div>;
  }

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-50">
      <div className="mt-20 w-full max-w-2xl p-8 bg-white shadow-lg rounded-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Chỉnh sửa hồ sơ</h2>
        {message && (
          <div
            className={`mb-4 p-2 rounded ${
              message.includes('thành công') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
          >
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Tên
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={userData.name}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Mật khẩu
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={userData.password}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
              Giới tính
            </label>
            <select
              id="gender"
              name="gender"
              value={userData.gender}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Chọn giới tính</option>
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="other">Khác</option>
            </select>
          </div>

          <div>
            <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">
              Ngày sinh
            </label>
            <input
              type="date"
              id="birthDate"
              name="birthDate"
              value={userData.birthDate}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Địa chỉ
            </label>
            <textarea
              id="address"
              name="address"
              value={userData.address}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows="3"
              required
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
