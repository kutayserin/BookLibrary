import axios from 'axios';

const API_URL = 'https://openlibrary.org/search.json';

export const searchBooks = async (query: string) => {
  try {
    const response = await axios.get(`${API_URL}?q=${query}`);
    return response.data.docs;
  } catch (error) {
    console.error(error);
    return [];
  }
};