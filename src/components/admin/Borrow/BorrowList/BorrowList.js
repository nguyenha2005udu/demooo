import React, { useState, useEffect } from 'react';
import borrowService from '../../../../services/admin/borrowService';
import Modal from '../../../../common/admin/Modal/Modal';
import Table from '../../../../common/admin/Table/Table';
import Button from '../../../../common/admin/Button/Button';
import Tooltip from '../../../../common/admin/Tooltip/Tooltip';
import { FaEdit, FaTrash, FaCheck, FaPlus } from 'react-icons/fa';
import EditBorrowForm from '../EditBorrowForm/EditBorrowForm';
import AddBorrowForm from '../AddBorrowForm/AddBorrowForm';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import debounce from 'lodash.debounce';

const BorrowList = () => {
  const [borrows, setBorrows] = useState([]);
  const [visibleForm, setVisibleForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [borrowId, setBorrowId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  // Fetch dữ liệu sách mượn khi component mount
  useEffect(() => {
    fetchBorrowList();
  }, []);

  const fetchBorrowList = async () => {
    try {
      const data = await borrowService.fetchAllBorrowed();
      setBorrows(data);
    } catch (error) {
      toast.error('Không thể tải danh sách phiếu mượn');
    }
  };

  const handleAddBorrow = async (borrow) => {
    try {
      const newBorrow = await borrowService.addBorrow(borrow);
      setBorrows((prev) => [...prev, newBorrow]);
      setVisibleForm(false);
      toast.success('Thêm phiếu mượn thành công');
    } catch (error) {
      toast.error('Lỗi khi thêm phiếu mượn');
    }
  };

  const handleUpdateBorrow = async (borrow) => {
    try {
      const updatedBorrow = await borrowService.updateBorrow(borrow.id, borrow);
      setBorrows((prev) =>
        prev.map((b) => (b.id === updatedBorrow.id ? updatedBorrow : b))
      );
      setVisibleForm(false);
      toast.success('Cập nhật phiếu mượn thành công');
    } catch (error) {
      toast.error('Lỗi khi cập nhật phiếu mượn');
    }
  };

  const handleDeleteBorrow = async () => {
    try {
      await borrowService.deleteBorrow(deleteTargetId);
      setBorrows((prev) => prev.filter((b) => b.id !== deleteTargetId));
      setShowDeleteModal(false);
      toast.success('Xóa phiếu mượn thành công');
    } catch (error) {
      toast.error('Lỗi khi xóa phiếu mượn');
    }
  };

  const filteredBorrows = borrows.filter((borrow) => {
    const matchesSearch =
      (borrow.bookTitle &&
        borrow.bookTitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (borrow.memberName &&
        borrow.memberName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || borrow.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    { label: 'Tên sách', field: 'bookTitle' },
    { label: 'Tên người mượn', field: 'memberName' },
    { label: 'Ngày mượn', field: 'transactionDate' },
    { label: 'Ngày trả dự kiến', field: 'dueDate' },
    {
      label: 'Trạng thái',
      field: 'status',
      render: (val, row) => (
        <span className={row.status === 'overdue' ? 'text-red-500' : 'text-green-500'}>
          {row.status === 'overdue' ? 'Quá hạn' : 'Đang mượn'}
        </span>
      ),
    },
    {
      label: 'Hành động',
      render: (val, row) => (
        <>
          <Tooltip content="Chỉnh sửa">
            <button
              onClick={() => {
                setVisibleForm(true);
                setIsEdit(true);
                setBorrowId(row.id);
              }}
              className="text-blue-500 hover:text-blue-700 mr-2"
            >
              <FaEdit />
            </button>
          </Tooltip>
          <Tooltip content="Xóa">
            <button
              onClick={() => {
                setDeleteTargetId(row.id);
                setShowDeleteModal(true);
              }}
              className="text-red-500 hover:text-red-700"
            >
              <FaTrash />
            </button>
          </Tooltip>
        </>
      ),
    },
  ];

  const debouncedSearch = debounce((e) => {
    setSearchTerm(e.target.value);
  }, 500);  // Delay search by 500ms

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">Danh Sách Phiếu Mượn</h1>

      {/* Thanh tìm kiếm và lọc */}
      <div className="flex justify-between mb-5">
        <input
          type="text"
          placeholder="Tìm kiếm..."
          value={searchTerm}
          onChange={debouncedSearch}
          className="p-2 border rounded-md w-64"
        />
        <div className="flex gap-3">
          <select
            onChange={(e) => setStatusFilter(e.target.value)}
            value={statusFilter}
            className="p-2 border rounded-md"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang mượn</option>
            <option value="returned">Đã trả</option>
            <option value="overdue">Quá hạn</option>
          </select>
          <button
            onClick={() => {
              setVisibleForm(true);
              setIsEdit(false);
            }}
            className="flex items-center bg-green-500 text-white px-4 py-2 rounded"
          >
            <FaPlus className="mr-2" /> Thêm Phiếu Mượn
          </button>
        </div>
      </div>

      {/* Bảng dữ liệu */}
      <Table columns={columns} data={filteredBorrows} />

      {/* Form thêm hoặc sửa */}
      <Modal isOpen={visibleForm} onClose={() => setVisibleForm(false)}>
        {isEdit ? (
          <EditBorrowForm
            borrowId={borrowId}
            onUpdate={handleUpdateBorrow}
            onClose={() => setVisibleForm(false)}
          />
        ) : (
          <AddBorrowForm onAdd={handleAddBorrow} onClose={() => setVisibleForm(false)} />
        )}
      </Modal>

      {/* Modal xác nhận xóa */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <h3>Bạn có chắc chắn muốn xóa phiếu mượn này?</h3>
        <div className="flex justify-center gap-4 mt-4">
          <Button onClick={handleDeleteBorrow} className="bg-red-500 text-white px-4 py-2 rounded">
            Xóa
          </Button>
          <Button onClick={() => setShowDeleteModal(false)} className="bg-gray-300 px-4 py-2 rounded">
            Hủy
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default BorrowList;
