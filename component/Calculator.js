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
  Button,
  TextInput,
  ScrollView,
  
} from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { Dropdown } from 'react-native-element-dropdown';
import { address } from 'addresspinas';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

import DateTimePicker from '@react-native-community/datetimepicker';

const data = [
  { label: 'Item 1', value: '1' },
  { label: 'Item 2', value: '2' },
  { label: 'Item 3', value: '3' },
  { label: 'Item 4', value: '4' },
  { label: 'Item 5', value: '5' },
  { label: 'Item 6', value: '6' },
  { label: 'Item 7', value: '7' },
  { label: 'Item 8', value: '8' },
];

export const Calculator = ({ navigation }) => {
  const [value, setValue] = useState(null)
  const [showAddImage, setShowAddImage] = useState(false)
  const [images, setImages] = useState([])

  const [munFocus, setMunFocus] = useState(false)
  const [brgyFocus, setBrgyFocus] = useState(false)
  const [munCode, setMunCode] = useState(null)
  const [brgyCode, setBrgyCode] = useState(null)
  const [region, setRegion] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const municipalities = address.getCityMunOfProvince('0516')
  const brgy = address.getBarangaysOfCityMun(munCode)
  console.log(brgy.barangays);

  const [date, setDate] = useState(new Date(1598051730000));
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

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
  useEffect(() => {
    getLocationAsync();
  }, []);

  const getLocationAsync = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setUserLocation(location.coords);
    setRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  };

  const handleUpdateLocation = async () => {
    let location = await Location.getCurrentPositionAsync({});
    setUserLocation(location.coords);
    setRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  
    console.log("Latitude:", location.coords.latitude);
    console.log("Longitude:", location.coords.longitude);
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };
  return (
    <>
      <ImageBackground source={require('../assets/brakrawnd.png')} resizeMode="cover" style={styles.image}>
        <View style={{ flex: 1, alignItems: 'center', }}>
          
          {/* {console.log("from onLoad:", images)} */}
          <Image source={require(`../assets/pinya.png`)} style={{ height: 90, width: 100 }} />
          <View style={{ flex: 1, alignItems: 'center', width: '100%' }}>
            {/* ImagesGal */}
            <View style={{ marginBottom: 8, width: '100%', height: 206, borderRadius: 6, padding: 4, backgroundColor: '#101010' }}>
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
                navigation.navigate('DataInputs')
              }}>
                <Text>Palitan</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.touch} onPress={() => {
                setShowAddImage(true)
              }}>
                <Text>Add Image</Text>
              </TouchableOpacity>
            </View>

            {/* FarmLoc */}
            <View style={{
              width: '100%',
              flexDirection: 'column',
              gap: 8,
              paddingVertical: 8,
            }}>
              <TextInput
                editable
                maxLength={40}
                onChangeText={text => onChangeText(text)}
                placeholder='Enter Farm Name'
                value={value}
                style={styles.dropdown}
              />
              <Dropdown
                style={[styles.dropdown, munFocus && { borderColor: 'blue' }]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                data={municipalities.cityAndMun}
                search
                maxHeight={220}
                labelField="name"
                valueField="mun_code"
                placeholder={!munFocus ? 'Select Municipalities' : '...'}
                searchPlaceholder="Search..."
                value={munCode}
                onFocus={() => setMunFocus(true)}
                onBlur={() => setMunFocus(false)}
                onChange={item => {
                  setMunCode(item.mun_code);
                  setMunFocus(false);
                }}
              />
              <Dropdown
                style={[styles.dropdown, brgyFocus && { borderColor: 'blue' }]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                data={brgy.barangays}
                search
                maxHeight={220}
                labelField="name"
                valueField="name"
                placeholder={!brgyFocus ? 'Select Barangay' : '...'}
                searchPlaceholder="Search..."
                value={brgyCode}
                onFocus={() => setBrgyFocus(true)}
                onBlur={() => setBrgyFocus(false)}
                onChange={item => {
                  setBrgyCode(item.name);
                  setBrgyFocus(false);
                }}
              />
            </View>

            <View style={styles.container1}>
        <MapView style={styles.map} region={region}>
          {userLocation && (
            <Marker
              coordinate={{
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
              }}
              title="Your Location"
              description="You are here!"
            />
          )}
        </MapView>
        <View style={styles.buttonContainer}>
          <Button title="Update Location" onPress={handleUpdateLocation} />
        </View>
      </View>
            <View>
              <Button onPress={showDatepicker} title="Petsa ng Pagtanim" />
              <Text>selected: {date.toLocaleString()}</Text>
              {show && (
                <DateTimePicker
                  testID="dateTimepicker"
                  value={date}
                  mode={mode}
                  is24Hour={true}
                  onChange={onChange}
                  style={ styles.text}
                />
              )}
            </View>
          </View>
          <TouchableOpacity style={styles.touch} onPress={() => {
            navigation.navigate('DataInputs')
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
  
  container1: {
    height: 200,
    width: '100%',
  },
  map: {
    height: 200,
    width: '100%',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    backgroundColor: 'white'
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
  text:{
 fontSize: 15,

  }
})