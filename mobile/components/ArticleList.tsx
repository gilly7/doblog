import React, { useState, useEffect } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import axios from "axios";
import { Text, ActivityIndicator, Divider } from "@react-native-material/core";

interface Article {
  id: string;
  title: string;
  content: string;
}

export default function ArticleList() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://your-api-endpoint.com/articles"
      );
      setArticles(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch articles");
      setLoading(false);
    }
  };

  const renderArticle = ({ item }: { item: Article }) => (
    <View style={styles.articleContainer}>
      <Text variant="h6">{item.title}</Text>
      <Text variant="body2" style={styles.content}>
        {item.content}
      </Text>
      <Divider style={styles.divider} />
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={articles}
      renderItem={renderArticle}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContainer}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
  },
  articleContainer: {
    marginBottom: 16,
  },
  content: {
    marginTop: 8,
  },
  divider: {
    marginTop: 16,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
