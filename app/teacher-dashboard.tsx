import React, { useState } from "react";
import {
  View,
  Button,
  FlatList,
  Image,
  StyleSheet,
  Text,
  Alert,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import axios from "axios";

interface Photo {
  id: string;
  uri: string;
  name: string;
}

export default function TeacherDashboard() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const roomId = "shreya"; // Hardcoded Room ID

  const uploadPhotos = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "image/*", // Allow only images
        multiple: true, // Enable multiple selection
        copyToCacheDirectory: true, // Ensure compatibility
      });

      if (result.canceled) {
        return; // User canceled the document picker
      }

      const selectedPhotos = result.assets.map((asset) => ({
        id: `${asset.name}-${Date.now()}`, // Generate a unique ID
        uri: asset.uri,
        name: asset.name,
      }));

      setPhotos((prevPhotos) => [...prevPhotos, ...selectedPhotos]);
    } catch (error) {
      Alert.alert("Error", "An error occurred while selecting images.");
      console.error("File Selection Error:", error);
    }
  };

  const handleUploadToServer = async () => {
    if (photos.length === 0) {
      Alert.alert("No Photos", "Please select photos to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("roomId", roomId);
    
    photos.forEach((photo) => {
      formData.append("images[]", {
        uri: photo.uri, // File URI
        type: "image/jpeg", // File type
        name: photo.name, // File name
      } as any); // Cast to `any` to suppress TypeScript error
    });

    try {
      const response = await axios.post("https://gallery.etoqe.shop/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        Alert.alert(
          "Upload Successful",
          `${response.data.message} Images uploaded to Room ID: ${roomId}`
        );
        setPhotos([]); // Clear photos after successful upload
      } else {
        Alert.alert("Upload Failed", response.data.message);
      }
    } catch (error) {
      Alert.alert("Upload Error", "An error occurred while uploading images.");
      console.error("Upload Error:", error);
    }
  };

  const removePhoto = (id: string) => {
    setPhotos((prevPhotos) => prevPhotos.filter((photo) => photo.id !== id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Teacher Dashboard</Text>
      <Button title="Select Photos" onPress={uploadPhotos} />
      {photos.length > 0 && (
        <Button title="Upload to Server" onPress={handleUploadToServer} color="#4CAF50" />
      )}
      {photos.length === 0 ? (
        <Text style={styles.noPhotosText}>No photos uploaded yet.</Text>
      ) : (
        <FlatList
          data={photos}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.gallery}
          renderItem={({ item }) => (
            <View style={styles.photoContainer}>
              <Image source={{ uri: item.uri }} style={styles.image} />
              <Text style={styles.imageName}>{item.name}</Text>
              <Button
                title="Remove"
                onPress={() => removePhoto(item.id)}
                color="#FF6347"
              />
            </View>
          )}
        />
      )}
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
  noPhotosText: {
    fontSize: 16,
    color: "#777",
    textAlign: "center",
    marginTop: 20,
  },
  gallery: {
    marginTop: 20,
  },
  photoContainer: {
    marginBottom: 10,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
    padding: 10,
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    marginBottom: 5,
  },
  imageName: {
    fontSize: 14,
    marginBottom: 5,
    color: "#555",
    textAlign: "center",
  },
});
