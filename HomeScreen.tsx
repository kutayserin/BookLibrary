import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, TextInput } from 'react-native';
import { searchBooks } from './api';

interface Book {
  key: string;
  title: string;
  cover_i: string;
}

const HomeScreen = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      const books = await searchBooks(query);
      setBooks(books);
      setLoading(false);
    };
    fetchBooks();
  }, [query]);

  const handleSearch = (text: string) => {
    setQuery(text);
  };

  return (
    <View>
      <TextInput
        placeholder="Search for books"
        value={query}
        onChangeText={handleSearch}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={books}
          renderItem={({ item }) => (
            <View>
              <Text>{item.title}</Text>
            </View>
          )}
          keyExtractor={(item) => item.key}
        />
      )}
    </View>
  );
};

export default HomeScreen;