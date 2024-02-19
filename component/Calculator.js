import React, { useState, useEffect } from 'react'
import {
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  ImageBackground,
  FlatList,
  TouchableHighlight,
  Alert
} from 'react-native'
import Carousel from 'react-native-snap-carousel'
import FastImage from 'react-native-fast-image';
import * as ImagePicker from 'expo-image-picker'

export const Calculator = ({ navigation }) => {
  const [value, setValue] = useState(null);
  const [showAddImage, setShowAddImage] = useState(false)
  const [images, setImages] = useState([])

  const openGallery = async () => {
    try {

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        quality: 1,
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
        quality: 1
      })

      if (!result.canceled) {
        addImage(result.assets[0].uri, result.assets[0].height, result.assets[0].width)
      }
    } catch (e) {
      console.log(e);
    }
  }

  const addImage = (image, height, width) => {
    setImages(images => [...images, { url: image, height: height, width: width }])
  }

  return (
    <>
      <ImageBackground source={require('../assets/brakrawnd.png')} resizeMode="cover" style={styles.image}>
        <View style={{ flex: 1, alignItems: 'center', }}>
          {console.log("from onLoad:", images)}
          <Image source={require(`../assets/pinya.png`)} style={{height: 90, width: 100}}/>

          {/* ImagesGal */}
          <View style={{ marginBottom: 8, width: '100%', height: 206,  borderRadius: 6, padding: 4, backgroundColor: '#101010' }}>
            {
              images &&
              <FlatList
                data={images}
                numColumns={3}
                renderItem={({ item }) => (
                  <View style={{ flex: 1 }}>
                    <Image style={{ width: '100%', height: 100, borderRadius: 5 }} source={{ uri: item.url }} />
                  </View>
                )}
                columnWrapperStyle={{
                  gap: 2,
                  marginBottom: 2
                }}
              />
            }
          </View>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity style={styles.touch} onPress={() => {
              navigation.navigate('ProductionInput')
            }}>
              <Text>Udo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.touch} onPress={() => {
              setShowAddImage(true)
            }}>
              <Text>Add Image</Text>
            </TouchableOpacity>
          </View>

          {/* FarmLoc */}
          <TouchableOpacity style={styles.touch} onPress={() => {
            navigation.navigate('ProductionInput')
          }}>
            <Text>Paglagay ng Pagsusuri</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground >

      <Modal animationType='fade' visible={showAddImage} transparent={true}>
        <View style={styles.addImage}>
          <TouchableOpacity style={styles.touch} onPress={() => {
            openGallery()
          }}>
            <Text>Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.touch} onPress={() => {
            openCamera()
          }}>
            <Text>Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.touch} onPress={() => {
            setShowAddImage(!showAddImage)
          }}>
            <Text>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  touch: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#206830',
    alignItems: 'center'
  },
  modalBackground: {
    backgroundColor: '#00000060',
    padding: 20,
    justifyContent: 'center',
    flex: 1
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 24,
  },
  image: {
    flex: 1,
    opacity: .8,
    paddingVertical: 36,
    paddingHorizontal: 12,
  },
  container: {
    backgroundColor: 'white',
    padding: 16,
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  addImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flexDirection: 'row'
  },
})