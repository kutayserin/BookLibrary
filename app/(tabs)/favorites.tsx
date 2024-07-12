import React, { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useFavoriteBooks } from '@/components/context/FavoriteBooksContext';
import { CustomIcon } from "@/components/icon/CustomIcon";
import { Book } from '@/components/interface/Book';

export default function FavoritesScreen() {
  const { favoriteBooks, addBookToFavorites, isBookInFavorites, removeBookFromFavorites } = useFavoriteBooks();
  const navigation = useNavigation();
  const [loadingDescriptions, setLoadingDescriptions] = useState<{ [key: string]: boolean }>({});
  const [descriptions, setDescriptions] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    favoriteBooks.forEach((book: Book | undefined) => {
      if (book?.key) {
        getDescription(book.key);
      }
    });
  }, [favoriteBooks]);

  const getDescription = async (key: string) => {
    setLoadingDescriptions(prevState => ({ ...prevState, [key]: true }));
    try {
      const response = await fetch(`https://openlibrary.org${key}.json`);
      const result = await response.json();
      setDescriptions(prevState => ({ ...prevState, [key]: result.description }));
    } catch (error) {
      console.error("Error in description:", error);
      setDescriptions(prevState => ({ ...prevState, [key]: "No description available" }));
    } finally {
      setLoadingDescriptions(prevState => ({ ...prevState, [key]: false }));
    }
  };

  const renderDescription = (desc: string | undefined) => {
    if (!desc) return "No description available";
  
    if (typeof desc !== 'string') return "No description available";
  
    const maxLines = 5;
    const descLines = desc.split('\n');
  
    if (descLines.length > maxLines) {
      return descLines.slice(0, maxLines).join('\n') + '...';
    } else {
      return desc;
    }
  };
  

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={favoriteBooks}
        keyExtractor={(item, index) => item.title + index}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              navigation.getParent()?.navigate("bookdetails", { book: item });
            }}
            style={styles.bookCardContainer}
          >
            <View style={styles.bookCard}>
              <Image
                source={{
                  uri: item.cover_i
                    ? `https://covers.openlibrary.org/b/id/${item.cover_i}-L.jpg`
                    : 'https://placehold.co/500x500',
                }}
                style={styles.bookImage}
              />
              <View style={styles.bookDetails}>
                <Text style={styles.bookTitle}>{item.title}</Text>
                <Text style={styles.bookAuthor}>{item.author_name?.[0] ?? 'N/A'}</Text>
                <Text numberOfLines={5} style={styles.bookDescription}>
                  {loadingDescriptions[item.key] ? (
                    <ActivityIndicator size="small" color="#0000ff" />
                  ) : (
                    renderDescription(descriptions[item.key])
                  )}
                </Text>
                <View style={styles.bookActions}>
                  <Text style={styles.publishDate}>{item.publish_date?.[0]}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      if (isBookInFavorites(item.isbn?.[0])) {
                        removeBookFromFavorites(item.isbn?.[0]);
                      } else {
                        addBookToFavorites(item);
                      }
                    }}
                    style={styles.iconButton}
                  >
                    <CustomIcon
                      name={isBookInFavorites(item.isbn?.[0]) ? 'star' : 'star-outline'}
                      color="orange"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f8f8f8',
  },
  bookCardContainer: {
    marginBottom: 10,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  bookCard: {
    flexDirection: 'row',
    padding: 10,
  },
  bookImage: {
    width: 100,
    height: 160,
    borderRadius: 10,
    marginRight: 10,
  },
  bookDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  bookAuthor: {
    fontSize: 14,
    marginTop: 5,
    color: '#666',
  },
  bookDescription: {
    fontSize: 12,
    marginTop: 5,
    color: '#888',
  },
  bookActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  publishDate: {
    fontSize: 12,
    color: '#888',
  },
  iconButton: {
    padding: 5,
    borderRadius: 10,
  },
});
