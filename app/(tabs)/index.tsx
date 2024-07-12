import { useFavoriteBooks } from "@/components/context/FavoriteBooksContext";
import { Book } from "@/components/interface/Book";
import { CustomIcon } from "@/components/icon/CustomIcon";
import { useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Skeleton } from "react-native-skeletons";

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const HomeScreen = () => {
  const [books, setBooks] = useState<Book[]>();
  const [dummyBooks, setDummyBooks] = useState<Book[]>();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const debouncedSearch = useDebounce(search, 390);

  useEffect(() =>{
    sampleBooks();
  }, [])
  useEffect(() => {
    fetchBooks();
  }, [debouncedSearch]);



  const fetchBooks = async () => {
    setLoading(true);
    
    try {
      const response = await fetch(
        `https://openlibrary.org/search.json?q=${debouncedSearch}&limit=10`
      );
      const result = await response.json();
      setBooks(result.docs);
    } catch (error) {
      console.error("Error searching books:", error);
    } finally {
      setLoading(false);
    }
  };

  const sampleBooks = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://openlibrary.org/search.json?q=ra&limit=20`
      );
      const result = await response.json();
      setDummyBooks(result.docs);
    } catch (error) {
      console.error("Error in books:", error);
    } finally {
      setLoading(false);
    }
  };

  

  const { addBookToFavorites, isBookInFavorites, removeBookFromFavorites  } = useFavoriteBooks();
  const navigation = useNavigation();

  const renderBookItem = ({ item }: { item: Book }) => (
    <View style={styles.gridItem}>
      <TouchableOpacity
        onPress={() => {
          navigation
            .getParent()
            ?.navigate("bookdetails", { book: item });
           
        }}
        style={styles.bookContainer}
      >
        <Image
          source={{
            uri: item.cover_i
              ? `https://covers.openlibrary.org/b/id/${item.cover_i}-L.jpg`
              : "https://placehold.co/500x500",
          }}
          alt="Book cover"
          style={styles.bookImage}
        />
        <Text style={styles.bookTitle}>{item.title}</Text>
        <Text style={styles.bookAuthor}>{item.author_name?.[0] ?? "N/A"}</Text>
      </TouchableOpacity>
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
        <Text style={styles.favoritesText}>
          {isBookInFavorites(item.isbn?.[0]) ? "Remove From Favorites" : "Add To Favorites"}
        </Text>
        <CustomIcon
          name={
            isBookInFavorites(item.isbn?.[0])
              ? "star"
              : "star-outline"
          }
          color={"orange"}
        />
      </TouchableOpacity>
    </View>
  );


  const renderDescription = (desc:any) => {
    if (typeof desc === "string") {
      return desc;
    } else if (typeof desc === "object" && desc !== null) {
      return desc.value || "No description available";
    } else {
      return "No description available";
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search any book..."
        value={search}
        onChangeText={setSearch}
      />
      {(!loading && !search) ? (
        <FlatList
          data={dummyBooks}
          keyExtractor={(item, index) => item.title + index}
          renderItem={renderBookItem}
          numColumns={2}
          columnWrapperStyle={styles.gridRow}
        />
      ) : loading ? (
        <FlatList
          data={[1, 2, 3, 4]}
          keyExtractor={(item, index) => `${index}`}
          renderItem={({ item, index }) => (
            <View style={styles.gridItem}>
              <Skeleton
                count={1}
                width={"100%"}
                height={180}
                color={"#b5b5b5"}
                borderRadius={10}
                style={{ marginBottom: 10 }}
              />
              <Skeleton
                count={1}
                width={"100%"}
                height={15}
                color={"#b5b5b5"}
                style={{ marginBottom: 5 }}
              />
              <Skeleton
                count={1}
                width={"100%"}
                height={15}
                color={"#b5b5b5"}
                style={{ marginBottom: 5 }}
              />
               <Skeleton
                count={1}
                width={"100%"}
                height={25}
                color={"#b5b5b5"}
                style={{ marginBottom: 5 }}
              />
            </View>
          )}
          numColumns={2}
          columnWrapperStyle={styles.gridRow}
        />
      ) : (
        <FlatList
          data={books}
          keyExtractor={(item, index) => item.title + index}
          renderItem={renderBookItem}
          numColumns={2}
          columnWrapperStyle={styles.gridRow}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: "#f8f8f8",
    paddingTop:-18
  },
  searchBar: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  gridRow: {
    justifyContent: "space-between",
  },
  gridItem: {
    flex: 1,
    margin: 5,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    padding:5,
    alignItems: "center",
  },
  bookContainer: {
    width: "100%",
    alignItems: "center",
  },
  bookImage: {
    width: "100%",
    height: 160,
    borderRadius: 10,
    marginBottom: 10,
    objectFit: "cover",
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  bookAuthor: {
    fontSize: 14,
    color: "gray",
    textAlign: "center",
    marginBottom: 5,
  },
  favoritesText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#3498db",
    textAlign: "center",
    marginRight: 5,
  },
  iconButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
    marginTop: 10,
  },
});

export default HomeScreen;
