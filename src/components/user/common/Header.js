import React, { useState, useEffect } from 'react';
import { UserCircle, Bell, LogOut, Heart } from 'lucide-react';

const Header = () => {
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [favoriteBooks, setFavoriteBooks] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);

  // Giả lập dữ liệu người dùng và thông báo
  useEffect(() => {
    const mockUser = {
      name: 'Nguyễn Văn A',
      avatar: 'https://example.com/avatar.jpg',
    };
    const mockNotifications = [
      { id: 1, message: 'Bạn có sách mới' },
      { id: 2, message: 'Ưu đãi đặc biệt' },
    ];
    const mockFavoriteBooks = [
      { id: 1, title: 'Đắc Nhân Tâm' },
      { id: 2, title: 'Nhà Giả Kim' },
      { id: 3, title: 'Cách Nghĩ Để Thành Công' },
    ];

    setIsLoggedIn(true);
    setUser(mockUser);
    setNotifications(mockNotifications);
    setFavoriteBooks(mockFavoriteBooks);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 20);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [prevScrollPos]);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setNotifications([]);
    setFavoriteBooks([]);
  };

  const toggleFavorites = () => {
    setShowFavorites(!showFavorites);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-500 ${
        visible ? 'translate-y-0' : '-translate-y-full'
      } bg-white bg-opacity-95 backdrop-blur-sm shadow-md py-4 px-6 md:px-10`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <a href="/" className="flex items-center gap-4">
          <img
            src="/assets/images/logo-preview.png"
            alt="Logo"
            className="w-12 h-12 object-contain transition-transform duration-300 hover:scale-105"
          />
          <span className="text-2xl font-bold text-gray-800 uppercase tracking-wider hidden md:inline-block">
            Wisdom's Beacon
          </span>
        </a>
        <nav>
          <ul className="flex gap-1 md:gap-2">
            {[
              { name: 'Trang chủ', path: '/' },
              { name: 'Danh mục', path: '/category' },
              { name: 'Tin tức', path: '/news' },
              { name: 'Giỏ sách', path: '/shopcart' },
            ].map((item) => (
              <li key={item.path}>
                <a
                  href={item.path}
                  className="text-gray-700 font-medium text-lg md:text-xl px-3 py-2 rounded-full transition-all duration-300 hover:text-blue-600 hover:bg-blue-50"
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <>
              {/* Icon sách yêu thích */}
              <div className="relative">
                <Heart
                  className="w-6 h-6 text-gray-600 cursor-pointer hover:text-red-600"
                  onClick={toggleFavorites}
                />
                {favoriteBooks.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {favoriteBooks.length}
                  </span>
                )}
                {showFavorites && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 z-10">
                    <h3 className="px-4 py-2 text-sm font-semibold text-gray-700">Sách yêu thích</h3>
                    {favoriteBooks.map((book) => (
                      <a
                        key={book.id}
                        href={`/book/${book.id}`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                      >
                        {book.title}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Icon thông báo */}
              <div className="relative">
                <Bell className="w-6 h-6 text-gray-600 cursor-pointer hover:text-blue-600" />
                {notifications.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </div>

              {/* Avatar người dùng */}
              <div className="flex items-center space-x-2">
                <img 
                  src='https://scontent.fhan18-1.fna.fbcdn.net/v/t39.30808-6/289693821_582015943280803_2102006602626651935_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=a5f93a&_nc_ohc=G0Vc9Sn0GZUQ7kNvgG2Loay&_nc_zt=23&_nc_ht=scontent.fhan18-1.fna&_nc_gid=AWxF11_1kpD51GjEtMQ9G1-&oh=00_AYBtle2IrxFt5bJrvJUmlmxA1cAfMm6xcQs7n_hu77tLew&oe=6762E0E4'
                  alt={user.name} 
                  className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
                />
                <span className="hidden md:inline text-gray-800 font-medium">
                  {user.name}
                </span>
              </div>

              {/* Nút đăng xuất */}
              <button
                  onClick={handleLogout}
                  className="ml-4 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Đăng xuất
                </button>
            </>
          ) : (
            <a
              href="/loginemail"
              className="flex items-center gap-2 text-white bg-blue-600 px-4 py-2 rounded-full transition-all duration-300 hover:bg-blue-700 shadow-md hover:shadow-lg"
            >
              <UserCircle className="w-5 h-5" />
              <span className="hidden md:inline">Đăng nhập</span>
            </a>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
