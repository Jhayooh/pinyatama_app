import { address } from 'addresspinas';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { GeoPoint, Timestamp, collection, doc, ref, setDoc, updateDoc, addDoc, storage } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import {
  Button,
  FlatList,
  Image,
  ImageBackground,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import { Dropdown } from 'react-native-element-dropdown';
import { auth, db } from '../firebase/Config';
import { TableBuilder } from './TableBuilder';

export const Calculator = ({ navigation }) => {
  const farmsColl = collection(db, 'farms')
  const [farmsData, farmsLoading, farmsError] = useCollectionData(farmsColl);
  const [showAddImage, setShowAddImage] = useState(false)

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const getDate = () => {
    let tempDate = date.toString().split(' ');
    return date !== ''
      ? `${tempDate[0]} ${tempDate[1]} ${tempDate[2]} ${tempDate[3]}`
      : '';
  };

  const [user] = useAuthState(auth)
  const [text, onChangeText] = useState(0);
  // const [first, setfirst] = useState(second)

  const [munFocus, setMunFocus] = useState(false)
  const [brgyFocus, setBrgyFocus] = useState(false)

  // data natin
  const [base, setBase] = useState('')
  const [area, setArea] = useState(0)
  const [cropStage, setCropStage] = useState('')
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date())
  const [farmName, setFarmName] = useState('')
  const [municipality, setMunicipality] = useState('')
  const [brgyCode, setBrgyCode] = useState(null)
  const [farmerName, setFarmerName] = useState('');
  const [sex, setSex] = useState('')
  const [userLocation, setUserLocation] = useState(null);
  const [images, setImages] = useState([])
  const [uploadedImg, setUploadedImg] = useState([])
  // end ng data natin

  const [munCode, setMunCode] = useState(null)
  const [region, setRegion] = useState(null);

  const municipalities = address.getCityMunOfProvince('0516')
  const brgy = address.getBarangaysOfCityMun(munCode)

  const [dataParti, setDataParti] = useState([])
  const queryParti = collection(db, 'particulars');
  const [qParti, lParti, eParti] = useCollectionData(queryParti)

  const [components, setComponents] = useState([])
  const [table, setTable] = useState(false)

  useEffect(() => {
    if (qParti) {
      setDataParti([...qParti])
    }
  }, [qParti]);

  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const addDocumentWithId = async () => {
    setIsShow(false)
    onChangeText('')
    try {
      const docParticular = doc(collParticular, text);
      await setDoc(docParticular, { name: text, totalInputs: 0 });
    } catch (error) {
      console.error('Error adding document:', error);
    }
  };

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

  const handleMapPress = (e) => {
    setUserLocation(e.nativeEvent.coordinate);
  };

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

  const addImage = (image, height, width) => {
    setImages(images => [...images, { url: image, height: height, width: width }])
  }

  const uploadImages = async (uri, fileType) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const filename = uri.substring(uri.lastIndexOf('/') + 1);

      const storageRef = ref(storage, `FarmImages/${user.uid}/${filename}`);
      const uploadTask = uploadBytesResumable(storageRef, blob);

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
            console.log('File available at', downloadURL);
            setUploadedImg((uImg) => [...uImg, { url: downloadURL, uid: user.uid }]);
          }).catch((error) => {
            console.error("Error getting download URL: ", error);
          });
        }
      );
    } catch (error) {
      console.error("Error uploading image: ", error);
    }
  };

  function goBack() {
    navigation.goBack()
  }

  // important function
  const saveInputs = async () => {

    try {
      const uploadPromises = images.map(img => uploadImages(img.url, "Image"));
      // Wait for all images to upload
      await Promise.all(uploadPromises);
      const newFarm = await addDoc(farmsColl, {
        area: area,
        brgy: brgyCode,
        farmerName: farmerName,
        cropStage: cropStage,
        start_date: startDate,
        harvest_date: endDate,
        geopoint: userLocation,
        mun: municipality,
        title: farmName,
        plantNumber: base,
        sex: sex,
        brgyUID: user.uid,
        images: uploadedImg
      })
      await updateDoc(newFarm, { id: newFarm.id })
      const farmComp = collection(db, `farms/${newFarm.id}/components`);
      Alert.alert(`Saved Successfully`, `${farmerName} is saved. Thank you very much for using this application. Donate at our charity using GCASH (+9564760102)`, [
        { text: 'Ok', onPress: () => goBack() },
      ]);
      // ^ Changed the collection path to include newFarm.id

      const eventsRef = collection(db, `farms/${newFarm.id}/events`);
      const vegetativeDate = new Date(Date.parse(startDate));
      const floweringDate = new Date(vegetativeDate);
      floweringDate.setMonth(vegetativeDate.getMonth() + 10);
      const fruitingDate = new Date(floweringDate);
      fruitingDate.setMonth(floweringDate.getMonth() + 3);
      const harvestDate = new Date(Date.parse(endDate));
      harvestDate.setMonth(fruitingDate.getMonth() + 5);

      const eRef_vegetative = await addDoc(eventsRef, {
        group: newFarm.id,
        title: "Vegetative",
        className: "vegetative",
        start_time: Timestamp.fromDate(vegetativeDate),
        end_time: Timestamp.fromDate(floweringDate)
      });
      await updateDoc(eRef_vegetative, { id: eRef_vegetative.id })

      const eRef_flowering = await addDoc(eventsRef, {
        group: newFarm.id,
        title: "Flowering",
        className: "flowering",
        start_time: Timestamp.fromDate(floweringDate),
        end_time: Timestamp.fromDate(fruitingDate)
      })
      await updateDoc(eRef_flowering, { id: eRef_flowering.id })

      const eRef_fruiting = await addDoc(eventsRef, {
        group: newFarm.id,
        title: "Fruiting",
        className: "fruiting",
        start_time: Timestamp.fromDate(fruitingDate),
        end_time: Timestamp.fromDate(harvestDate)
      })
      await updateDoc(eRef_fruiting, { id: eRef_fruiting.id })

      components.forEach(async (component) => {
        try {

          await addDoc(farmComp, {
            ...component
          })
        } catch (e) {
          console.log("error sa components:", e);
        }
      })

    } catch (e) {
      console.log("Saving Error: ", e);
    }
    setImages([])
    setUploadedImg([])
  }
  const BottomButton = () => {
    const confirmSave = () =>
      Alert.alert(`Confirm`, `Do you want to save ${farmerName}?`, [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'YES', onPress: () => saveInputs() },
      ]);

    return (
      <View style={{ marginTop: 6, width: '100%', marginBottom: 16 }}>
        <TouchableOpacity style={{ ...styles.touch, flex: 0, width: '100%' }} onPress={confirmSave}>
          <Text style={styles.text}>SAVE</Text>
        </TouchableOpacity>
      </View>
    )
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
    const lat = location.coords.latitude
    const long = location.coords.latitude
    setUserLocation(new GeoPoint(lat, long));
    // console.log(location.coords);
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

  const hideDatePicker = () => {
    setDatePickerVisibility(false)
  }

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const getMult = (numOne, numTwo) => {
    const num = numOne * numTwo
    return parseFloat(num.toFixed(0))
  }

  const handleBase = () => {
    const baseValue = parseFloat(base);

    const plantingMaterials = dataParti.find(item => item.name === "Planting Materials");
    const ferZero = dataParti.find(item => item.name === "0-0-60");
    const ferUrea = dataParti.find(item => item.name === "Urea");
    const Diuron = dataParti.find(item => item.name === "Diuron");
    const Sticker = dataParti.find(item => item.name === "Sticker");

    const pmQnty = getMult(area, 30000)
    const fZeroQnty = getMult(area, 5)
    const fUreaQnty = getMult(area, 5)
    const dQnty = getMult(area, 2)
    const sQnty = getMult(area, 1)

    if (baseValue === 0) {
      return;
    }

    setComponents([
      { ...plantingMaterials, qnty: pmQnty, totalPrice: getMult(pmQnty, plantingMaterials.price), },
      { ...ferZero, qnty: fZeroQnty, totalPrice: getMult(fZeroQnty, ferZero.price) },
      { ...ferUrea, qnty: fUreaQnty, totalPrice: getMult(fUreaQnty, ferUrea.price) },
      { ...Diuron, qnty: dQnty, totalPrice: getMult(dQnty, Diuron.price) },
      { ...Sticker, qnty: sQnty, totalPrice: getMult(sQnty, Sticker.price) }
    ])

    setTable(true)
  }


  return (
    <>
      <ImageBackground source={require('../assets/p1.jpg')} resizeMode="cover" style={styles.image}>
        <View style={{ flex: 1, alignItems: 'center', }}>
          <ScrollView
            showsVerticalScrollIndicator={false} style={{ width: '100%' }}
          >
            {/* particulars  */}
            <View style={styles.category_container}>
              <Text style={styles.head}>1. Land Area</Text>
              {
                lParti
                  ?
                  <ActivityIndicator />
                  :
                  <>
                    {/* Number 1 */}
                    <View style={{ display: 'flex', flexDirection: 'row' }}>

                      <TextInput
                        editable
                        // maxLength={40}
                        onChangeText={(base) => {
                          setBase(base)
                          setArea(parseFloat((base / 30000).toFixed(4)))
                        }}
                        placeholder='No. of plants'
                        keyboardType='numeric'
                        value={base}
                        style={{ ...styles.dropdown, flex: 3 }}
                        disabled
                      />
                      <Button title='Calculate' style={{ flex: 1 }} onPress={() =>
                        handleBase()
                      } />
                    </View>
                    {table && <TableBuilder components={components} area={area} />}
                  </>
              }
              <View style={{ height: '1%', borderBottomColor: '#FAF1CE', borderBottomWidth: .2, marginBottom: 6 }}></View>

              {/* Number 2 */}
              <Text style={styles.head}>2. QP Farm Details</Text>
              <TextInput
                editable
                maxLength={40}
                onChangeText={text => setCropStage(text)}
                placeholder='Stage of Crops'
                value={cropStage}
                style={styles.dropdown}

              />
              <TextInput
                style={styles.dropdown}
                value={startDate.toLocaleDateString()}
                placeholder="Date of Planting"
              />
              <Button onPress={showDatePicker} title="Date of Planting" />
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={(date) => {
                  setStartDate(date)
                  hideDatePicker()
                  console.log(startDate);
                }}
                onCancel={hideDatePicker}
                style={{ marginBottom: 10 }}
              />

              <TextInput
                style={styles.dropdown}
                value={endDate.toLocaleDateString()}
                placeholder="Date of Harvest"
              />
              <Button onPress={showDatePicker} title="Date of Harvest" />

              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={(date) => {
                  setEndDate(date)
                  hideDatePicker()
                }}
                onCancel={hideDatePicker}
                style={{ marginBottom: 10 }}
              />

              <View style={{ height: '1%', borderBottomColor: '#FAF1CE', borderBottomWidth: .2, marginBottom: 6 }}></View>

              {/* numberThree */}
              <Text style={styles.head}>3. Input Farm Location</Text>
              <View style={{
                width: '100%',
                flexDirection: 'column',
                gap: 8,
                paddingVertical: 8,
              }}>
                <TextInput
                  editable
                  maxLength={40}
                  onChangeText={text => setFarmName(text)}
                  placeholder='Enter Farm Name'
                  value={farmName}
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
                    setMunicipality(item.name)
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
                <View style={{ height: '1%', borderBottomColor: '#FAF1CE', borderBottomWidth: .2, marginBottom: 6 }}></View>

                {/* numberFour */}
                <Text style={styles.head}>4. Farmer Details</Text>
                <TextInput
                  editable
                  maxLength={40}
                  onChangeText={text => setFarmerName(text)}
                  placeholder='Name of Farmer'
                  value={farmerName}
                  style={styles.dropdown}
                />
                <TextInput
                  editable
                  maxLength={40}
                  onChangeText={text => setSex(text)}
                  placeholder='Sex'
                  value={sex}
                  style={styles.dropdown}
                />
                <View style={{ height: '1%', borderBottomColor: '#FAF1CE', borderBottomWidth: .2, marginBottom: 6 }}></View>

                {/* numberFive */}
                <Text style={styles.head}>5. Upload Farm Images</Text>
                <View style={{ marginBottom: 8, width: '100%', height: 180, borderRadius: 6, padding: 4, backgroundColor: '#101010' }}>
                  {
                    images &&
                    <FlatList
                      data={images}
                      // numColumns={3}
                      horizontal={true}
                      renderItem={({ item }) => (
                        <View style={{ flex: 1 }}>
                          <Image style={{ height: '100%', width: 240, borderRadius: 6 }} source={{ uri: item.url }} />
                        </View>
                      )}
                      ItemSeparatorComponent={() =>
                        <View style={{ width: 4, height: '100%' }}></View>
                      }
                    // columnWrapperStyle={{
                    //   gap: 2,
                    //   marginBottom: 2
                    // }}
                    />
                  }
                  <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity style={styles.touch} onPress={() => {
                      setShowAddImage(true)
                    }}>
                      <Text style={styles.text}>Add Image</Text>
                    </TouchableOpacity>
                  </View>
                </View>

              </View>
              {/* <View style={styles.container1}>
                <MapView style={styles.map} region={region} onPress={handleMapPress}>
                  {userLocation && (
                    <Marker
                      coordinate={{
                        latitude: userLocation.latitude,
                        longitude: userLocation.longitude,
                      }}
                      title="Your Location"
                      description="You are here!"
                      draggable
                      onDragEnd={(e) => setUserLocation(e.nativeEvent.coordinate)}
                    />
                  )}
                </MapView>
                <View style={styles.buttonContainer}>
                  <Button title="Update Location" onPress={handleUpdateLocation} />
                </View>
              </View> */}

              {/* ImagesGal */}
            </View>
          </ScrollView>
          <BottomButton />
        </View >

      </ImageBackground >

      <Modal animationType='fade' visible={showAddImage} transparent={true}>
        <View style={styles.addImage}>
          <TouchableOpacity style={styles.touch} onPress={() => {
            openGallery()
          }}>
            <Text style={styles.text}>Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.touch} onPress={() => {
            openCamera()
          }}>
            <Text style={styles.text}>Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.touch} onPress={() => {
            setShowAddImage(!showAddImage)
          }}>
            <Text style={styles.text}>Close</Text>
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
    alignItems: 'center',
    textAlign: 'center',
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
    backgroundColor: 'green',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#206830',
    flex: 1,
  },
  textInput: {
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 5,
    padding: 10,
  },
  image: {
    flex: 1,
    opacity: 1.0,
    paddingTop: 36,
  },

  map: {
    height: 200,
    width: '100%',
  },

  dropdown: {
    height: 50,
    opacity: 1.0,
    borderColor: 'green',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    backgroundColor: 'white',
    marginBottom: 6,
    color: 'black'
  },

  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
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
  text: {
    fontSize: 15,
    fontFamily: 'serif',
    fontWeight: 'bold',
    color: 'white'
  },
  text1: {
    fontSize: 15,
    fontFamily: 'serif',
    fontWeight: 'bold',
    color: 'black'
  },
  category_container: {
    padding: 10,
    margin: 16,
    opacity: 1.0,
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 5


  },
  head: {
    fontSize: 20,
    fontFamily: 'serif',
    fontWeight: 'bold',
    color: 'green',
    marginBottom: 8,
  },

  modalContent: {
    backgroundColor: 'white',
    width: 280,
    padding: 20,
    borderRadius: 10,
    elevation: 5, // Android shadow
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 9,
  },
  verifyButton: {
    position: 'absolute',
    alignSelf: 'center',
    right: 0,
  },

});


