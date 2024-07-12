import { Book } from "../interface/Book";
import React, { createContext, useContext, useState } from "react";

const FavoriteBooksContext = createContext<any>([]);

export const useFavoriteBooks = () => {
  return useContext(FavoriteBooksContext);
};

export const FavoriteBooksProvider = ({ children }: any) => {
  const [favoriteBooks, setFavoriteBooks] = useState<Book[]>([]);

  const addBookToFavorites = (book: Book) => {
    setFavoriteBooks((prevFavorites) => [...prevFavorites, book]);
  };

  const isBookInFavorites = (isbn: string) => {
    return favoriteBooks.some((book) => book.isbn.includes(isbn));
  };

  const removeBookFromFavorites = (isbn: string) => {
    setFavoriteBooks((prevFavorites) =>
      prevFavorites.filter((book) => !book.isbn.includes(isbn))
    );
  };

  

  return (
    <FavoriteBooksContext.Provider
      value={{
        favoriteBooks,
        addBookToFavorites,
        isBookInFavorites,
        removeBookFromFavorites,
      }}
    >
      {children}
    </FavoriteBooksContext.Provider>
  );
};
