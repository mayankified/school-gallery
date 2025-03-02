import React, { useState } from 'react';
import { View, Button, FlatList, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const TeacherDashboard = () => {
  const [photos, setPhotos] = useState([]);

  const uploadPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setPhotos([...photos, result.assets[0].uri]);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Upload Photo" onPress={uploadPhoto} />
      <FlatList
        data={photos}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.image} />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  image: { width: '100%', height: 200, marginBottom: 10 },
});

export default TeacherDashboard;
