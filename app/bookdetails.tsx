import { Book } from "@/components/interface/Book";
import { Collapsible } from "@/components/Collapsible";
import { useFavoriteBooks } from "@/components/context/FavoriteBooksContext";
import { CustomIcon } from "@/components/icon/CustomIcon";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, TouchableOpacity, View } from "react-native";

const BookDetails: React.FC = () => {
  const route: any = useRoute();
  const currentBook: Book = route.params?.book || {};
  const { addBookToFavorites, isBookInFavorites, removeBookFromFavorites } = useFavoriteBooks();
  const [loading, setLoading] = useState(true);
  const [description, setDescription] = useState("");


  useEffect(() => {
    if (currentBook.key) {
      getDescription();
    }
  }, [currentBook]);

  const getDescription = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://openlibrary.org${currentBook?.key}.json`
      );
      const result = await response.json();
      setDescription(result.description);
    } catch (error) {
      console.error("Error in description:", error);
    } finally {
      setLoading(false);
    }
  };

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
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#C0C0C0", dark: "#C0C0C0" }}
      headerImage={
        <Image
          source={{
            uri: currentBook.cover_i
              ? `https://covers.openlibrary.org/b/id/${currentBook.cover_i}-L.jpg`
              : "https://placehold.co/500x500",
          }}
          style={styles.headerImage}
        />
      }
    >
      <View style={styles.titleContainer}>
        <ThemedText type="title">{currentBook.title || "No Title"}</ThemedText>
      </View>
      <View style={styles.row}>
        <ThemedText>
          {currentBook.author_name?.[0] ?? "N/A"}{"\t\t"}-{"\t\t"}
          {currentBook.publish_date?.[0] ?? "N/A"}
        </ThemedText>

        <TouchableOpacity
          onPress={() => {
            if (isBookInFavorites(currentBook.isbn?.[0])) {
              removeBookFromFavorites(currentBook.isbn?.[0]);
            } else {
              addBookToFavorites(currentBook);
            }
          }}
          style={styles.iconButton}
        >
          <CustomIcon
            name={
              isBookInFavorites(currentBook.isbn?.[0])
                ? "star"
                : "star-outline"
            }
            color={"orange"}
          />
        </TouchableOpacity>
      </View>
      <ThemedText>
        {loading ? <ActivityIndicator size={"large"}/> : renderDescription(description)}
      </ThemedText>
      <View style={styles.gridContainer}>
        <View style={styles.gridItem}>
          <Collapsible title="Subjects">
            {currentBook?.subject?.length > 0 ? (
              currentBook.subject.map((subject, index) => (
                <ThemedText key={index} style={{ marginBottom: 5 }}>
                  {index + 1}. {subject}
                </ThemedText>
              ))
            ) : (
              <ThemedText>Subjects not provided</ThemedText>
            )}
          </Collapsible>
        </View>
        <View style={styles.gridItem}>
          <Collapsible title="Languages">
            {currentBook?.language?.length > 0 ? (
              <ThemedText style={{ marginBottom: 10 }}>
                {currentBook.language.join(", ")}
              </ThemedText>
            ) : (
              <ThemedText>Languages not provided</ThemedText>
            )}
          </Collapsible>
        </View>
        <View style={styles.gridItem}>
          <Collapsible title="Format">
            {currentBook?.format?.length > 0 ? (
              currentBook.format.map((sentence, index) => (
                <ThemedText key={index} style={{ marginBottom: 10 }}>
                  {sentence}
                </ThemedText>
              ))
            ) : (
              <ThemedText>Format not provided</ThemedText>
            )}
          </Collapsible>
        </View>
        <View style={styles.gridItem}>
          <Collapsible title="First sentence">
            {currentBook?.first_sentence?.length > 0 ? (
              currentBook.first_sentence.map((sentence, index) => (
                <ThemedText key={index} style={{ marginBottom: 10 }}>
                  {sentence}
                </ThemedText>
              ))
            ) : (
              <ThemedText>First sentence not provided</ThemedText>
            )}
          </Collapsible>
        </View>
        <View style={styles.gridItem}>
          <Collapsible title="Publishers">
            {currentBook?.publisher?.length > 0 ? (
              currentBook.publisher.map((publisher, index) => (
                <ThemedText key={index} style={{ marginBottom: 5 }}>
                  {index + 1}. {publisher}
                </ThemedText>
              ))
            ) : (
              <ThemedText>Publishers not provided</ThemedText>
            )}
          </Collapsible>
        </View>
        <View style={styles.gridItem}>
          <Collapsible title="ISBN">
            {currentBook?.isbn?.length > 0 ? (
              <ThemedText style={{ marginBottom: 10 }}>
                {currentBook.isbn.join(", ")}
              </ThemedText>
            ) : (
              <ThemedText>ISBN not provided</ThemedText>
            )}
          </Collapsible>
        </View>
      </View>
    </ParallaxScrollView>
  );
};

export default BookDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  iconButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    marginLeft: 5,
    color: "#000",
  },
  headerImage: {
    width: "100%",
    height: "100%",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 10,
  },
  gridItem: {
    width: "48%",
    marginBottom: 10,
  },
});
