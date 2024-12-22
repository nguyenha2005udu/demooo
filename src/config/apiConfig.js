export const API_ENDPOINTS = {
  BASE_URL: 'https://librarybe-f7dpbmd5fte9ggd7.southeastasia-01.azurewebsites.net/', // hoặc 'http://localhost:8080' tùy vào môi trường 'http://localhost:8080' tùy vào môi trường
  USER: {
    BOOKS: '/books/categories',
    BOOK: '/books',
    SUGGESTBOOK:'/books/suggest',
    CATEGORYBOOK:'/books/categories'
  },
  ADMIN: {
    BOOKS: '/books',
    ADDBOOKS: '/books',
    DELETEBOOKS: '/books/delete',
    EDITBOOKS: '/books/update',
    CATEGORIES: '/books/categories',
    MEMBERS: '/members',
    ADDMEM: '/members/register',
    EDITMEMBER: '/members/update',
    DELETEMEM: '/members/delete',
    POSTS: '/posts', // Lấy tất cả bài viết
    UPDATEPOSTS: '/posts/update', // Cập nhật bài viết
    ADDPOSTS: '/posts',
    DELETEPOSTS: '/posts/delete',// Xóa bài viết theo id
    BORROWED: '/transactions/borrowed',
    ADDBORROWED: '/transactions/borrow',
    ADDRETURN: '/transactions/return',
    ADDRENEW: '/transactions/renew',
    RETURNED: '/transactions/returned',
    PENDING: '/transactions/pending',
    APPROVE: '/transactions/approve',
  },
  STATISTICS: {
    CATEGORY: '/books/category-distribution',
  },
  TRANSACTIONS:{
    BORROW:'/transactions/borrow'
  } 
};
