import { address } from 'addresspinas';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { GeoPoint, Timestamp, collection, doc, setDoc, updateDoc, addDoc, FieldValue } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
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
import MapView, { Marker } from 'react-native-maps';

import { Dropdown } from 'react-native-element-dropdown';
import { auth, db, storage } from '../firebase/Config';
import { TableBuilder } from './TableBuilder';

export const Calculator = ({ navigation }) => {
  const farmsColl = collection(db, 'farms')
  const [farmsData, farmsLoading, farmsError] = useCollectionData(farmsColl);
  const [showAddImage, setShowAddImage] = useState(false)

  const queryParti = collection(db, 'particulars');
  const [qParti, lParti, eParti] = useCollectionData(queryParti)

  const [startPicker, setStartPicker] = useState(false);
  const [endPicker, setEndPicker] = useState(false);

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

  const [components, setComponents] = useState([])
  const [roiDetails, setRoiDetails] = useState({})
  const [table, setTable] = useState(false)
  const [saving, setSaving] = useState(false)
  const [calculating, setCalculating] = useState(false)

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
  const handleMapPress = (e) => {
    setUserLocation(e.nativeEvent.coordinate);
  };

  const addImage = (image, height, width) => {
    setImages(images => [...images, { url: image, height: height, width: width }])
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

      const storageRef = ref(storage, `FarmImages/${newFarm.id}/${filename}`);
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
            console.log('File available at', typeof (downloadURL));
            setUploadedImg([...uploadedImg, downloadURL])
            console.log("this is the uploaded img:", uploadedImg);
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
      })
      await updateDoc(newFarm, { id: newFarm.id })
      const farmComp = collection(db, `farms/${newFarm.id}/components`);
      const eventsRef = collection(db, `farms/${newFarm.id}/events`);
      const roiRef = collection(db, `farms/${newFarm.id}/roi`);
      Alert.alert(`Saved Successfully`, `${farmerName} is saved. Thank you very much for using this application. Donate at our charity using GCASH (+9564760102)`, [
        {
          text: 'Ok', onPress: () => {
            setSaving(false)
            goBack()
          }
        },
      ])
      components.forEach(async (component) => {
        try {

          await addDoc(farmComp, {
            ...component
          })
        } catch (e) {
          console.log("error sa components:", e);
        }
      })

      const newRoi = await addDoc(roiRef, {
        ...roiDetails
      })
      await updateDoc(newRoi, { id: newRoi.id })

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

      for (const img of images) {
        const upImg = await uploadImages(img.url, "Image", newFarm.id);
        console.log("dl url", upImg);

        setUploadedImg([...uploadedImg, upImg])
        await updateDoc(newFarm, { images: uploadedImg })
        console.log("this is the uploaded images:", uploadedImg);
      }
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
        {
          text: 'YES', onPress: () => {
            setSaving(true)
            saveInputs()
          }
        },
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
    return parseFloat(num)
  }

  const handleBase = () => {
    const baseValue = parseFloat(base);
    if (baseValue === 0) {
      return;
    }

    const newComponents = qParti.map(item => {
      const newQnty = getMult(area, item.defQnty)
      return { ...item, qntyPrice: newQnty, totalPrice: getMult(newQnty, item.price), price: parseInt(item.price) };
    });

    setComponents(newComponents);
    setTable(true);
    setCalculating(false);
  };


  return (
    <>
      <ImageBackground source={require('../assets/p1.jpg')} resizeMode="cover" style={styles.image}>
        <View style={{ flex: 1, alignItems: 'center' }} >

          <ScrollView
            showsVerticalScrollIndicator={false} style={{ width: '100%' }}
          >
            {/* particulars  */}
            <View style={styles.category_container}>
              <Text style={styles.head}>1. Land Area</Text>
              {
                <>
                  {/* Number 1 */}
                  <View style={{ display: 'flex', flexDirection: 'row' }}>

                    <TextInput
                      editable
                      // maxLength={40}
                      onChangeText={(base) => {
                        setBase(base)
                        setArea(parseFloat(base / 30000))
                      }}
                      placeholder='No. of plants'
                      keyboardType='numeric'
                      value={base}
                      style={{ ...styles.dropdown, flex: 3 }}
                      disabled
                    />
                    {
                      lParti && calculating
                        ?
                        <ActivityIndicator style={{ flex: 1 }} size='small' color='#FF5733' />
                        :
                        <TouchableOpacity style={{ marginLeft: 10, justifyContent: 'center' }} onPress={() => {
                          setCalculating(true)
                          handleBase()
                        }
                        } >
                          <Image source={require('../assets/calc.png')} style={{ width: 30, height: 30 }} />
                        </TouchableOpacity>
                    }
                  </View>
                  {table && <TableBuilder components={components} area={area} setRoiDetails={setRoiDetails} />}
                </>
              }
              <View style={{ height: '1%', borderBottomColor: '#FAF1CE', borderBottomWidth: .2, marginBottom: 6 }}></View>

              {/* Number 2 */}
              <Text style={styles.head}>2. QP Farm Details</Text>
              <Dropdown
                style={styles.dropdown}
                placeholder="Select Stage of Crops"
                data={['Vegetative', 'Flowering', 'Fruiting', 'Harvesting']}
                value={cropStage}
                onChange={value => setCropStage(value)}
              />
              <View style={{ display: 'flex', flexDirection: 'row' }}>
                <TextInput
                  style={{ ...styles.dropdown, flex: 3 }}
                  value={startDate.toLocaleDateString()}
                  placeholder="Date of Planting"
                />
                <TouchableOpacity onPress={() => setStartPicker(true)} style={{ marginLeft: 10, justifyContent: 'center' }}>
                  <Image source={require('../assets/cal.png')} style={{ width: 30, height: 30 }} />
                </TouchableOpacity>

                <DateTimePickerModal
                  isVisible={startPicker}
                  mode="date"
                  onConfirm={(date) => {
                    setStartDate(date)
                    setStartPicker(false)
                  }}
                  onCancel={() => setStartPicker(false)}
                  style={{ marginBottom: 10 }}
                />
              </View>
              {/* <TextInput
                style={styles.dropdown}
                value={endDate.toLocaleDateString()}
                placeholder="Date of Harvest"
              />
              <Button onPress={() => setEndPicker(true)} title="Date of Harvest" />

              <DateTimePickerModal
                isVisible={endPicker}
                mode="date"
                onConfirm={(date) => {
                  setEndDate(date)
                  setEndPicker(false)
                }}
                onCancel={() => setEndPicker(false)}
                style={{ marginBottom: 10 }}
              /> */}

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
                <View style={styles.container1}>
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
                </View>
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
                 <Dropdown
                 style={styles.dropdown}
                 placeholder='Select Sex'
                 data={['Male','Female']}
                 value={sex}
                 onChangeText={text => setSex(text)}   
                 />
                {/* <TextInput
                  editable
                  maxLength={40}
                  onChangeText={text => setSex(text)}
                  placeholder='Sex'
                  value={sex}
                  style={styles.dropdown}
                /> */}
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
              {/* ImagesGal */}
            </View>
          </ScrollView>
          <BottomButton />
        </View >
      </ImageBackground >
      {saving && <ActivityIndicator color='#FF5733' size='large' style={styles.loading} />}

      <Modal animationType='fade' visible={showAddImage} transparent={true}>
        <View style={styles.addImage}>
          <TouchableOpacity style={styles.cam} onPress={() => {
            openGallery()
          }}>
            <Image source={require('../assets/gallery.png')}/>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cam} onPress={() => {
            openCamera()
          }}>
            <Image source={require('../assets/upload.png')}/>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cam} onPress={() => {
            setShowAddImage(!showAddImage)
          }}>
            <Image source={require('../assets/close.png')}/>
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
  cam: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    alignItems: 'center',
    textAlign: 'center',
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
    backgroundColor: 'white',
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
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(150, 150, 150, 0.6)'
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


