import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../../../common/admin/Modal/Modal";
import Table from "../../../common/admin/Table/Table";
import Tooltip from "../../../common/admin/Tooltip/Tooltip";
import AddReaderForm from "./AddReaderForm";
import EditReaderForm from "./EditReaderForm";
import { deleteReader, updateReader, addReader } from "../../../redux/admin/readerReducer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faInfoCircle, faPlus } from "@fortawesome/free-solid-svg-icons";

// Component DeleteModal
const DeleteModal = ({ isOpen, onConfirm, onCancel }) => (
  <Modal onClose={onCancel} isOpen={isOpen}>
    <div className="p-6 text-center">
      <h3 className="text-lg font-semibold">Bạn có chắc chắn muốn xóa độc giả này?</h3>
      <div className="mt-4 space-x-4">
        <button
          onClick={onConfirm}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          Xóa
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
        >
          Hủy
        </button>
      </div>
    </div>
  </Modal>
);

// Component InfoModal
const InfoModal = ({ isOpen, onClose, selectedReader }) => (
  <Modal onClose={onClose} isOpen={isOpen}>
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Thông Tin Sách Đang Mượn</h2>
      {selectedReader ? (
        <>
          {selectedReader.borrowedBooks && selectedReader.borrowedBooks.length > 0 ? (
            <ul>
              {selectedReader.borrowedBooks.map((book, index) => (
                <li key={index} className="mb-4">
                  <p><strong>Tựa sách:</strong> {book.title}</p>
                  <p><strong>Ngày mượn:</strong> {book.borrowDate}</p>
                  <p><strong>Ngày trả dự kiến:</strong> {book.dueDate}</p>
                  <p>
                    <strong>Trạng thái:</strong>{" "}
                    {book.status === "returned"
                      ? "Đã trả"
                      : book.status === "overdue"
                      ? "Quá hạn"
                      : "Đang mượn"}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p>Độc giả này hiện không mượn sách nào.</p>
          )}
        </>
      ) : (
        <p>Không có thông tin độc giả.</p>
      )}
      <button
        onClick={onClose}
        className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
      >
        Đóng
      </button>
    </div>
  </Modal>
);

const ReaderList = () => {
  const readers = useSelector((state) => state.readers || []);
  const dispatch = useDispatch();

  const [visibleForm, setVisibleForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedReader, setSelectedReader] = useState(null);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Lọc độc giả theo từ khóa tìm kiếm
  const filteredReaders = readers.filter((reader) =>
    reader.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reader.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { label: "Tên", field: "name" },
    { label: "Email", field: "email" },
    { label: "Địa Chỉ", field: "address" },
    { label: "Số Điện Thoại", field: "phone" },
    {
      label: "Hành động",
      render: (val, row) => (
        <div className="flex gap-3">
          <Tooltip content="Xem thông tin" position="left">
            <button
              onClick={() => {
                setSelectedReader(row);
                setInfoModalOpen(true);
              }}
              className="text-blue-500 hover:text-blue-700"
            >
              <FontAwesomeIcon icon={faInfoCircle} size="lg" />
            </button>
          </Tooltip>

          <Tooltip content="Chỉnh sửa" position="left">
            <button
              onClick={() => {
                setVisibleForm(true);
                setIsEdit(true);
                setSelectedReader(row);
              }}
              className="text-yellow-500 hover:text-yellow-700"
            >
              <FontAwesomeIcon icon={faEdit} size="lg" />
            </button>
          </Tooltip>

          <Tooltip content="Xóa độc giả" position="left">
            <button
              onClick={() => {
                setDeleteTargetId(row.id);
                setDeleteModalOpen(true);
              }}
              className="text-red-500 hover:text-red-700"
            >
              <FontAwesomeIcon icon={faTrash} size="lg" />
            </button>
          </Tooltip>
        </div>
      ),
    },
  ];

  const handleDelete = () => {
    dispatch(deleteReader(deleteTargetId));
    setDeleteModalOpen(false);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold mb-4 text-gray-800">Danh Sách Độc Giả</h1>

      {/* Thanh tìm kiếm */}
      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Tìm kiếm độc giả..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          onClick={() => {
            setVisibleForm(true);
            setIsEdit(false);
            setSelectedReader(null);
          }}
        >
          <FontAwesomeIcon icon={faPlus} />
          Thêm Độc Giả
        </button>
      </div>

      {/* Bảng danh sách độc giả */}
      <Table columns={columns} data={filteredReaders} />

      {/* Modal Thêm/Sửa Độc Giả */}
      <Modal onClose={() => setVisibleForm(false)} isOpen={visibleForm}>
        {isEdit ? (
          <EditReaderForm
            reader={selectedReader}
            onClose={() => setVisibleForm(false)}
            onUpdate={(reader) => dispatch(updateReader(reader))}
          />
        ) : (
          <AddReaderForm
            onClose={() => setVisibleForm(false)}
            onAdd={(reader) => dispatch(addReader(reader))}
          />
        )}
      </Modal>

      {/* Modal Xem Thông Tin */}
      <InfoModal
        isOpen={infoModalOpen}
        onClose={() => setInfoModalOpen(false)}
        selectedReader={selectedReader}
      />

      {/* Modal Xóa */}
      <DeleteModal
        isOpen={deleteModalOpen}
        onConfirm={handleDelete}
        onCancel={() => setDeleteModalOpen(false)}
      />
    </div>
  );
};

export default ReaderList;
