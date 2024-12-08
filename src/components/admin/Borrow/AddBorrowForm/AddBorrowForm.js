import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../../../../common/admin/Modal/Modal";
import { addBorrow } from "../../../../redux/admin/borrowsReducer";
import "./AddBorrowForm.css";

const AddBorrowForm = ({ setVisibleForm }) => {
  const dispatch = useDispatch();
  const [bookTitle, setBookTitle] = useState("");
  const [borrowerPhone, setBorrowerPhone] = useState("");
  const [borrowerEmail, setBorrowerEmail] = useState("");
  const [borrowerName, setBorrowerName] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [suggestedBooks, setSuggestedBooks] = useState([]);
  const [showModalMessage, setShowModalMessage] = useState(false);

  const readers = useSelector((state) => state.readers);
  const books = useSelector((state) => state.books);

  useEffect(() => {
    const existingReader = readers.find(
      (reader) =>
        reader.email === borrowerEmail || reader.phone === borrowerPhone
    );
    if (existingReader) {
      setBorrowerName(existingReader.name);
    } else {
      setBorrowerName("");
    }
  }, [borrowerEmail, borrowerPhone, readers]);

  const handleBookTitleChange = (e) => {
    const title = e.target.value;
    setBookTitle(title);
    if (title.trim() !== "") {
      const suggestions = books.filter((book) =>
        book.title.toLowerCase().includes(title.toLowerCase())
      );
      setSuggestedBooks(suggestions);
    } else {
      setSuggestedBooks([]);
    }
  };

  const isPhoneValid = (phone) => /^\d{10}$/.test(phone);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isPhoneValid(borrowerPhone)) {
      alert("Số điện thoại phải đủ 10 số!");
      return;
    }

    const existingReader = readers.find(
      (reader) =>
        reader.email === borrowerEmail || reader.phone === borrowerPhone
    );

    if (!existingReader) {
      setShowModalMessage(true);
      return;
    }

    const borrowDate = new Date().toISOString();
    const newBorrow = {
      id: Date.now(),
      bookTitle,
      borrowerName,
      borrowerPhone,
      borrowerEmail,
      borrowDate,
      dueDate,
      status: "active",
    };

    dispatch(addBorrow(newBorrow));
    setVisibleForm(false);
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-6">Thêm Phiếu Mượn</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Tên Sách:
          <input
            type="text"
            value={bookTitle}
            onChange={handleBookTitleChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          {suggestedBooks.length > 0 && (
            <ul className="mt-2 bg-white shadow-md border rounded-md max-h-40 overflow-y-auto">
              {suggestedBooks.map((book) => (
                <li
                  key={book.id}
                  onClick={() => {
                    setBookTitle(book.title);
                    setSuggestedBooks([]);
                  }}
                  className="cursor-pointer p-2 hover:bg-gray-100"
                >
                  {book.title}
                </li>
              ))}
            </ul>
          )}
        </label>
        <label className="block text-sm font-medium text-gray-700">
          Số Điện Thoại:
          <input
            type="text"
            value={borrowerPhone}
            onChange={(e) => setBorrowerPhone(e.target.value)}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </label>
        <label className="block text-sm font-medium text-gray-700">
          Email:
          <input
            type="email"
            value={borrowerEmail}
            onChange={(e) => setBorrowerEmail(e.target.value)}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </label>
        <label className="block text-sm font-medium text-gray-700">
          Ngày Trả Dự Kiến:
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </label>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Thêm Phiếu Mượn
        </button>
      </form>

      {showModalMessage && (
        <Modal onClose={() => setShowModalMessage(false)} isOpen={showModalMessage}>
          <h2 className="text-xl font-semibold text-center mb-4">Thông Báo</h2>
          <p className="text-center mb-4">Người mượn chưa tồn tại. Vui lòng thêm người mượn trước.</p>
          <button
            onClick={() => setShowModalMessage(false)}
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Đóng
          </button>
        </Modal>
      )}
    </div>
  );
};

export default AddBorrowForm;
