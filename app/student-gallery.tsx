import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  Image,
  StyleSheet,
  Text,
  ActivityIndicator,
  Alert,
} from "react-native";
import axios from "axios";

interface Photo {
  id: string;
  url: string;
  uploadDate: string;
}

export default function StudentGallery() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const roomId = "shreya"; // Hardcoded Room ID

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await axios.get(
          `https://gallery.etoqe.shop/room/${roomId}`
        );

        if (response.data.success) {
          // Map API response to Photo type
          const images = response.data.images.map((image: any, index: number) => ({
            id: index.toString(),
            url: image.image_url,
            uploadDate: image.upload_date,
          }));
          setPhotos(images);
        } else {
          Alert.alert("Error", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching photos:", error);
        Alert.alert("Error", "Failed to fetch photos from the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loaderText}>Loading photos...</Text>
      </View>
    );
  }

  if (photos.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Gallery</Text>
        <Text style={styles.noPhotosText}>No photos available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gallery</Text>
      <FlatList
        data={photos}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.gallery}
        renderItem={({ item }) => (
          <View style={styles.photoContainer}>
            <Image source={{ uri: item.url }} style={styles.image} />
            <Text style={styles.imageDate}>{item.uploadDate}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#F9F9F9",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    alignSelf: "center",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
  },
  loaderText: {
    fontSize: 18,
    color: "#555",
    marginTop: 10,
  },
  noPhotosText: {
    fontSize: 16,
    color: "#777",
    textAlign: "center",
    marginTop: 20,
  },
  gallery: {
    justifyContent: "space-between",
  },
  photoContainer: {
    flex: 1,
    margin: 5,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
    padding: 5,
  },
  image: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
  },
  imageDate: {
    fontSize: 12,
    color: "#777",
    marginTop: 5,
    textAlign: "center",
  },
});
