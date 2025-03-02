import React, { useEffect, useState } from 'react';
import { View, FlatList, Image, StyleSheet, Text } from 'react-native';

const StudentGallery = () => {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    // Mock fetching photos
    const fetchPhotos = async () => {
      setPhotos([
        { id: '1', url: 'https://via.placeholder.com/300' },
        { id: '2', url: 'https://via.placeholder.com/300' },
      ]);
    };
    fetchPhotos();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gallery</Text>
      <FlatList
        data={photos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Image source={{ uri: item.url }} style={styles.image} />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  image: { width: '100%', height: 200, marginBottom: 10 },
});

export default StudentGallery;
