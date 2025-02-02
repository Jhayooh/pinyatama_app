import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Modal, TouchableOpacity, ScrollView, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Dimensions } from 'react-native';

// db
import { storage } from '../firebase/Config';
import { deleteObject, getDownloadURL, listAll, ref, uploadBytesResumable } from 'firebase/storage';
import { ActivityIndicator } from 'react-native-paper';

const screenWidth = Dimensions.get('window').width;
const ImagesTab = ({ route }) => {
  const { farm } = route.params;
  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([])
  const [showAddImage, setShowAddImage] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);

  // Fetching and displaying images
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const listRef = ref(storage, `FarmImages/${farm.id}`);
        const result = await listAll(listRef);

        const imagePromises = result.items.map(async (itemRef) => {
          const downloadURL = await getDownloadURL(itemRef);
          console.log("dlURL:", downloadURL);
          console.log("itemRef:", itemRef);

          return {
            src: downloadURL,
            ref: itemRef,
          };
        });
        const imagesData = await Promise.all(imagePromises);
        setImages(imagesData);
      } catch (error) {
        console.error('Error fetching images: ', error);
      }
    };
    fetchImages();
  }, [farm]);

  // Adding image
  const addImage = (image, height, width) => {
    setImages((images) => [...images, { src: image, height, width }]);
    setNewImages((images) => [...images, { src: image, height, width }]);
  };
  
  const openGallery = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.6,
      });
  
      if (!result.canceled) {
        result.assets.forEach((asset) => {
          addImage(asset.uri, asset.height, asset.width);
        });
      }
    } catch (e) {
      console.log(e);
    }
  };
  
  const openCamera = async () => {
    try {
      await ImagePicker.requestCameraPermissionsAsync();
      let result = await ImagePicker.launchCameraAsync({
        cameraType: ImagePicker.CameraType.back,
        quality: 0.6,
      });
  
      if (!result.canceled) {
        addImage(result.assets[0].uri, result.assets[0].height, result.assets[0].width);
      }
    } catch (e) {
      console.log(e);
    }
  };
  
  const uploadImages = (uri, newFarm) => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch(uri);
        const blob = await response.blob();
        const filename = uri.substring(uri.lastIndexOf('/') + 1);
  
        const storageRef = ref(storage, `FarmImages/${newFarm}/${filename}`);
        const uploadTask = uploadBytesResumable(storageRef, blob);
  
        uploadTask.on(
          'state_changed',
          (snapshot) => {
          },
          (error) => {
            console.error('Error uploading image: ', error);
            reject(error);
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(downloadURL); 
            } catch (error) {
              console.error('Error getting download URL: ', error);
              reject(error);
            }
          }
        );
      } catch (error) {
        console.error('Error uploading image: ', error);
        reject(error);
      }
    });
  };
  
  const handleSave = async () => {
    try {
      const uploadPromises = newImages.map((img) => uploadImages(img.src, farm.id));
      Alert.alert('Success', 'All images uploaded successfully');
    } catch (e) {
      console.log('Saving Error: ', e);
      Alert.alert('Error', 'Some images failed to upload');
    }
  };
  

  const handleSelectImage = (imageRef) => {
    setSelectedImages((prevSelected) =>
      prevSelected.includes(imageRef)
        ? prevSelected.filter((ref) => ref !== imageRef)
        : [...prevSelected, imageRef]
    );
  };

  const handleDeleteSelected = async () => {
    try {
      const deletePromises = selectedImages.map((imageRef) => deleteObject(imageRef));
      await Promise.all(deletePromises);
      setImages((prevImages) => prevImages.filter((image) => !selectedImages.includes(image.ref)));
      setSelectedImages([]);
      Alert.alert('Success', 'Selected images have been deleted');
    } catch (error) {
      console.error('Error deleting images: ', error);
    }
  };

  return (
    <>
      <View style={{ flex: 1, padding: 10 }}>
        <View style={styles.screen}>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
            <TouchableOpacity style={styles.button} onPress={() => setShowAddImage(true)}>
              <Text style={{ color: '#fff', fontSize: 15, textAlign: 'center', }}>Magdagdag ng Larawan</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity style={{ ...styles.button, backgroundColor: 'red' }} onPress={() => handleDeleteSelected}>
              <Text style={{ color: '#fff', fontSize: 15, textAlign: 'center', }}>Delete Image</Text>
            </TouchableOpacity> */}
          </View>
          <ScrollView>
            <View style={styles.container}>
              {images.map((image, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.imageContainer}
                  onPress={() => handleSelectImage(image.ref)}
                >
                  <Image source={{ uri: image.src }} style={{ width: '100%', height: '100%' }} />
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
      <View>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.save}>I-save</Text>
        </TouchableOpacity>
      </View>
      <Modal animationType='fade' visible={showAddImage} transparent={true}>
        <View style={styles.addImage}>
          <View style={styles.modalContainer}>
            <TouchableOpacity onPress={openGallery}>
              <Image source={require('../assets/gallery.png')} style={{ width: 42, height: 42 }} />
              <Text>Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={openCamera}>
              <Image source={require('../assets/upload.png')} style={{ width: 42, height: 42 }} />
              <Text>Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowAddImage(false)}>
              <Image source={require('../assets/close.png')} style={{ width: 42, height: 42 }} />
              <Text>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 5,
    paddingBottom: 14,
    borderRadius: 12,
    marginTop: 10,
    backgroundColor: '#FFF',
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
    marginBottom: 10,
    height: '100%'
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
  },
  imageContainer: {
    margin: 1,
    width: (screenWidth - 50) / 3,
    height: (screenWidth - 50) / 3,
    overflow: 'hidden',
  },
  addImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    flexDirection: 'row',
    gap: 32,
    padding: 32,
    borderRadius: 8,
  },
  button: {
    flex: 1,
    backgroundColor: 'orange',
    borderRadius: 8,
    padding: 12,

    alignSelf: 'flex-end',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    margin: 10,
  },
  saveButton: {
    backgroundColor: '#52be80',
    borderRadius: 8,
    padding: 12,
    alignSelf: 'flex-end',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    margin: 10,
    paddingHorizontal: 50,
    marginHorizontal: 16,
  },
  save: {
    color: '#fff',
    fontSize: 20,
  }

});

export default ImagesTab;
