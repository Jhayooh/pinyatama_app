import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Modal, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

//db
import { storage, db, auth } from '../firebase/Config';
import { deleteObject, getDownloadURL, listAll, ref, uploadBytesResumable } from 'firebase/storage';
import { addDoc, collection, updateDoc } from 'firebase/firestore';

const ImagesTab = ({ route }) => {
  const { farm } = route.params
  const [images, setImages] = useState([]);
  const [showAddImage, setShowAddImage] = useState(false)
  const [selectedImages, setSelectedImages] = useState([]);


  //fetching and displaying image
  useEffect(() => {
    const fetchImages = async () => {

      try {
        const listRef = ref(storage, `FarmImages/${farm.id}`);
        const result = await listAll(listRef);

        const imagePromises = result.items.map(async (itemRef) => {
          const downloadURL = await getDownloadURL(itemRef);
          return {
            src: downloadURL,
            ref: itemRef
          };
        });
        const imagesData = await Promise.all(imagePromises);
        setImages(imagesData);
      } catch (error) {
        console.error('Error fetching images : ', error);
      }
    };
    fetchImages();
  }, [farm]);

  //adding image
  const addImage = (image, height, width) => {
    setImages(images => [...images, { src: image, height: height, width: width }])
  }

  const openGallery = async () => {
    try {

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        quality: .6,
      });

      if (!result.canceled) {
        addImage(result.assets[0].uri, result.assets[0].height, result.assets[0].width)
      }
    } catch (e) {
      console.log(e);
    }
  }

  const openCamera = async () => {
    try {
      await ImagePicker.requestCameraPermissionsAsync();
      let result = await ImagePicker.launchCameraAsync({
        cameraType: ImagePicker.CameraType.back,
        quality: .6
      })

      if (!result.canceled) {
        addImage(result.assets[0].uri, result.assets[0].height, result.assets[0].width)
      }
    } catch (e) {
      console.log(e);
    }
  }

  const uploadImages = async (uri, fileType, newFarm) => {
    try {
      console.log("number 1");
      const response = await fetch(uri);
      const blob = await response.blob();
      const filename = uri.substring(uri.lastIndexOf('/') + 1);
      console.log("number 2");

      const storageRef = ref(storage, `FarmImages/${newFarm}/${filename}`);
      const uploadTask = uploadBytesResumable(storageRef, blob);
      console.log("number 3");
      uploadTask.on('state_changed',
        (snapshot) => {
          // Handle progress
        },
        (error) => {
          console.error("Error uploading image: ", error);
        },
        () => {
          // Upload completed successfully, get download URL
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          }).catch((error) => {
            console.error("Error getting download URL: ", error);
          });
        }
      );

    } catch (error) {
      console.error("Error uploading image: ", error);
    }
  };

  const SaveImage = async () => {
    try {
      for (const img of images) {
        const upImg = await uploadImages(img.url, "Image", farm.id);
        console.log("Image uploaded successfully:", upImg);
      }
    } catch (e) {
      console.log("Saving Error: ", e);
    }
  };

  function goBack() {
    navigation.goBack()
  }

  //deleting image
  const handleSelectImage = (imageRef) => {
    setSelectedImages((prevSelected) => {
      if (prevSelected.includes(imageRef)) {
        return prevSelected.filter((ref) => ref !== imageRef);
      } else {
        return [...prevSelected, imageRef];
      }
    });
  };

  handleDeleteSelected = async () => {
    try {
      const deletePromises = selectedImages.map((imageRef) => deleteObject(imageRef));
      await Promise.all(deletePromises);
      setImages((prevImages) => prevImages.filter((image) => !selectedImages.includes(image.ref)));
      setSelectedImages([]);
    } catch (error) {
      console.error('Error deleting images', error);
    }
  };

  return (
    <>
      <View>
        <View style={styles.screen}>
          <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <TouchableOpacity style={styles.button} onPress={() => {
              setShowAddImage(true)
            }}>
              <Text style={{ color: '#fff', fontSize: 15, }}>Add Image</Text>
            </TouchableOpacity>
            <TouchableOpacity 
            style={styles.button} 
            onPress={() => { handleDeleteSelected()}}>
              <Text style={{ color: '#fff', fontSize: 15, }}>Delete Image</Text>
              {/* <Image source={require('../assets/trash.png')}  width={20} height={50} /> */}
            </TouchableOpacity>
          </View>
          <View style={styles.container}>
            {images?.map((image, index) => (
              <TouchableOpacity
                key={index}
                style={styles.imageContainer}
                onPress= {() => { handleSelectImage(image.Ref) }}
              >
                <Image
                  source={{ uri: image.src }}
                  style={{ width: '100%', height: '100%' }}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
      <Modal animationType='fade' visible={showAddImage} transparent={true}>
        <View style={styles.addImage}>
          <View style={styles.modalContainer}>
            <TouchableOpacity onPress={() => {
              openGallery()
            }}>
              <Image source={require('../assets/gallery.png')} style={{ width: 42, height: 42 }} />
              <Text>Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              openCamera()
            }}>
              <Image source={require('../assets/upload.png')} style={{ width: 42, height: 42 }} />
              <Text>Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              setShowAddImage(!showAddImage)
            }}>
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
    backgroundColor: '#fff',
    padding: 5,
    display: 'flex',
    // justifyContent: 'flex-start',
    // alignItems: 'flex-start',
    height: '100%',

  },
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    // justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    width: '100%'
  },

  imageContainer: {
    margin: 2,
    width: '32.3%',
    height: '22%',
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
    backgroundColor: 'orange',
    borderRadius: 8,
    padding: 12,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    margin: 10
  }
})
export default ImagesTab;
