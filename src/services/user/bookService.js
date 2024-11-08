const API_URL = 'http://10.147.19.246:8080/books/categories';

const bookService = {
  fetchBooksByCategory: async (bigCategorySlug, subCategorySlug) => {
    try {      
      const response = await fetch(`${API_URL}/${bigCategorySlug}/${subCategorySlug}/books`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Service error:', error);
      throw error;
    }
  },
};

export default bookService;