import { address } from 'addresspinas';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { GeoPoint, Timestamp, collection, doc, setDoc, updateDoc, addDoc, FieldValue } from 'firebase/firestore';
import React, { useEffect, useState, useRef } from 'react';
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
  Alert,
  Switch
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

  const focusNumplants = useRef(null)
  const focusCropstage = useRef(null)

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
  const [cropStage, setCropStage] = useState('vegetative')
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date())
  const [farmName, setFarmName] = useState('')
  const [municipality, setMunicipality] = useState('')
  const [brgyCode, setBrgyCode] = useState(null)
  const [farmerName, setFarmerName] = useState('');
  const [sex, setSex] = useState(null)
  const [userLocation, setUserLocation] = useState(null);
  const [fieldId, setFieldId] = useState('')
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
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

  const [isNext, setIsNext] = useState(false)

  const [firstnameFocus, setFirstnameFocus] = useState(false)
  const [lastnameFocus, setLastnameFocus] = useState(false)
  const [farmnameFocus, setFarmnameFocus] = useState(false)
  const [fieldidFocus, setFieldidFocus] = useState(false)
  const [startdateFocus, setStartdateFocus] = useState(false)
  const [calculateFocus, setCalculateFocus] = useState(false)

  useEffect(() => {
    if (!lastname){
      return
    }
    setFarmName(lastname + ' QP Farm')
  }, [lastname])


  function GetIndObj(object, id, key) {
    return object.filter((obj) => {
      return obj[key] === id;
    });
  }
  const usersCol = collection(db, 'users');
  const [users, loadingUsers] = useCollectionData(usersCol)

  useEffect(() => {
    if (!loadingUsers) {
      const indUser = GetIndObj(users, user.uid, 'id')
      setMunicipality(indUser[0].mun)
      setBrgyCode(indUser[0].brgy)
    }
  }, [users])

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

  function calcRoi() {

  }

  // important function
  const saveInputs = async () => {
    try {
      const newFarm = await addDoc(farmsColl, {
        area: area,
        brgy: brgyCode,
        farmerName: firstname + lastname,
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

      Alert.alert(`Saved Successfully`, `${farmName} is saved.`, [
        {
          text: 'Ok', onPress: () => {
            setSaving(false)
            goBack()
          }
        },
      ])

      const vegetativeDate = new Date(Date.parse(startDate));

      const floweringDate = new Date(vegetativeDate);
      floweringDate.setMonth(vegetativeDate.getMonth() + 10);

      const fruitingDate = new Date(floweringDate);
      fruitingDate.setMonth(floweringDate.getMonth() + 3);

      const harvestDate = new Date(fruitingDate);
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
    const checkMissing = () => {
      if (!base) {
        Alert.alert('Walang laman haha', 'Maglagay ng bilang ng tanim.', [
          {
            text: 'Ok',
            onPress: () => { focusNumplants.current.focus() },
            style: 'cancel'
          }
        ])
        return
      }
      if (!table) {
        Alert.alert('Walang laman haha', 'Kalkyuladuhin ang bilang ng tanim.', [
          {
            text: 'Ok',
            onPress: () => { focusNumplants.current.focus() },
            style: 'cancel'
          }
        ])
        return
      }
      if (!cropStage) {
        Alert.alert('Walang laman haha', 'Maglagay ng stage ng tanim.', [
          {
            text: 'Ok',
            onPress: () => { focusNumplants.current.focus() },
            style: 'cancel'
          }
        ])
        return
      }
      confirmSave()
    }

    const confirmSave = () =>
      Alert.alert(`Confirm`, `Do you want to save ${farmName}?`, [
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
      <>
        <TouchableOpacity style={{
          ...styles.button,
          backgroundColor: '#FFF',
          borderWidth: 1,
          borderColor: '#4DAF50',
          ...styles.buttonTwo
        }} onPress={() => setIsNext(false)}>
          <Text style={{ color: '#4DAF50', fontSize: 16 }}>Prev</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{
          ...styles.button,
          ...styles.buttonTwo
        }} onPress={checkMissing}>
          <Text style={{ color: '#fff', fontSize: 16 }}>SAVE</Text>
        </TouchableOpacity>

      </>
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
  const data = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
  ];

  const [isFocus, setIsFocus] = useState(false);

  const toggleSwitch = (switchValue) => {
    setSex(switchValue === sex ? null : switchValue);
  };

  const switchMale = () => toggleSwitch('Male');
  const switchFemale = () => toggleSwitch('Female');

  return (
    <>
      <View style={styles.screen}>
        <ScrollView style={styles.scroll}>
          {
            isNext ?
              <>
                <View style={{ ...styles.section, marginHorizontal: table ? 0 : 14, paddingHorizontal: 8 }}>
                  <Text style={styles.header}>CALCULATE</Text>
                  <View style={styles.subsection}>
                    <Text style={styles.supText}>Number of Plants</Text>
                    <View style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
                      <TextInput
                        editable
                        onChangeText={(base) => {
                          setBase(base)
                          setArea(parseFloat(base / 30000))
                          setTable(false)
                        }}
                        ref={focusNumplants}
                        placeholder='Enter number of plants'
                        keyboardType='numeric'
                        value={base}
                        style={calculateFocus ? { ...styles.textInputFocus, borderBottomRightRadius: 0, borderTopRightRadius: 0 } : { ...styles.textInput, borderBottomRightRadius: 0, borderTopRightRadius: 0 }}
                        onFocus={() => setCalculateFocus(true)}
                        onBlur={() => setCalculateFocus(false)}
                      />
                      {
                        lParti && calculating
                          ?
                          <ActivityIndicator style={{ flex: 1 }} size='small' color='#FF5733' />
                          :
                          <TouchableOpacity onPress={() => {
                            setCalculating(true)
                            handleBase()
                          }} style={{ ...styles.button, backgroundColor: '#F5C115', borderBottomLeftRadius: 0, borderTopLeftRadius: 0, paddingHorizontal: 22, paddingVertical: 0, justifyContent: 'center' }}>
                            <Image source={require('../assets/calc.png')} style={{}} />
                            {/* <Text style={{color: '#FFF'}}>Select</Text> */}
                          </TouchableOpacity>
                      }
                    </View>
                  </View>
                  {table && <TableBuilder components={components} area={area} setRoiDetails={setRoiDetails} />}
                </View>
                <View style={{ ...styles.section, marginBottom: 32, paddingTop: 14 }}>
                  <View style={{ ...styles.buttonContainer }}>
                    <BottomButton />
                  </View>
                </View>
              </> :

              <>
                {/* Farmer Detail */}
                <View style={styles.section}>
                  <Text style={styles.header}>FARMER INFORMATION</Text>
                  <View style={styles.subsection}>
                    <Text style={styles.supText}>First Name</Text>
                    <TextInput
                      editable
                      onChangeText={text => setFirstname(text)}
                      placeholder='Enter firstname of farmer'
                      value={firstname}
                      style={firstnameFocus ? styles.textInputFocus : styles.textInput}
                      onFocus={() => setFirstnameFocus(true)}
                      onBlur={() => setFirstnameFocus(false)}
                    />
                  </View>
                  <View style={styles.subsection}>
                    <Text style={styles.supText}>Last Name</Text>
                    <TextInput
                      editable
                      onChangeText={text => setLastname(text)}
                      placeholder='Enter lastname of farmer'
                      value={lastname}
                      style={lastnameFocus ? styles.textInputFocus : styles.textInput}
                      onFocus={() => setLastnameFocus(true)}
                      onBlur={() => setLastnameFocus(false)}
                    />
                  </View>
                  <View style={styles.subsection}>
                    <Text style={styles.supText}>Select Gender</Text>
                    <View style={styles.switches}>
                      <View style={styles.switchContainer}>
                        <Text style={styles.genderText}>Male</Text>
                        <Switch
                          trackColor={{ false: '#E8E7E7', true: '#FCF0C5' }}
                          thumbColor={sex === 'Male' ? '#F5C115' : '#f4f3f4'}
                          ios_backgroundColor="#3e3e3e"
                          onValueChange={switchMale}
                          value={sex === 'Male'}
                        />
                      </View>
                      <View style={styles.switchContainer}>
                        <Text style={styles.genderText}>Female</Text>
                        <Switch
                          trackColor={{ false: '#E8E7E7', true: '#FCF0C5' }}
                          thumbColor={sex === 'Female' ? '#F5C115' : '#f4f3f4'}
                          ios_backgroundColor="#3e3e3e"
                          onValueChange={switchFemale}
                          value={sex === 'Female'}
                        />
                      </View>
                    </View>
                  </View>
                </View>

                {/* Farm Location */}
                <View style={styles.section}>
                  <Text style={styles.header}>FARM INFORMATION</Text>
                  <View style={styles.subsection}>
                    <Text style={styles.supText}>Farm Name</Text>
                    <TextInput
                      editable
                      maxLength={40}
                      onChangeText={text => setFarmName(text)}
                      placeholder='Enter farm name'
                      value={farmName}
                      style={farmnameFocus ? styles.textInputFocus : styles.textInput}
                      onFocus={() => setFarmnameFocus(true)}
                      onBlur={() => setFarmnameFocus(false)}
                    />
                  </View>
                  <View style={styles.subsection}>
                    <Text style={styles.supText}>Field ID</Text>
                    <TextInput
                      editable
                      maxLength={40}
                      onChangeText={text => setFieldId(text)}
                      placeholder='Enter field id'
                      value={fieldId}
                      style={fieldidFocus ? styles.textInputFocus : styles.textInput}
                      onFocus={() => setFieldidFocus(true)}
                      onBlur={() => setFieldidFocus(false)}
                    />
                  </View>
                  <View style={styles.subsection}>
                    <Text style={styles.supText}>Municipality</Text>
                    <TextInput
                      editable={false}
                      maxLength={40}
                      placeholder='Enter farm municipality'
                      value={municipality}
                      style={styles.textInput}
                    />
                  </View>
                  <View style={styles.subsection}>
                    <Text style={styles.supText}>Barangay</Text>
                    <TextInput
                      maxLength={40}
                      disabled={false}
                      placeholder='Enter farm barangay'
                      value={brgyCode}
                      style={styles.textInput}
                    />
                  </View>
                  <View style={styles.subsection}>
                    <Text style={styles.supText}>Location</Text>
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
                      <View>
                        <TouchableOpacity style={{ ...styles.button, borderTopLeftRadius: 0, borderTopRightRadius: 0, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 22, paddingVertical: 8, justifyContent: 'center', gap: 12 }} onPress={() => {
                          handleUpdateLocation()
                        }}>
                          <Image source={require('../assets/loc.png')} style={{}} />
                          <Text style={{ color: '#E8E7E7', fontSize: 18 }}>Update Location</Text>
                        </TouchableOpacity>
                        {/* <Button title="Update Location" onPress={handleUpdateLocation} /> */}
                      </View>
                    </View>
                  </View>
                </View>

                {/* farm details */}
                <View style={styles.section}>
                  <Text style={styles.header}>FARM DETAIL</Text>
                  <View style={styles.subsection}>
                    <Text style={styles.supText}>Date of Planting</Text>
                    <View style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
                      <TextInput
                        value={startDate.toLocaleDateString()}
                        placeholder="Date of Planting"
                        style={startdateFocus ? { ...styles.textInputFocus, borderBottomRightRadius: 0, borderTopRightRadius: 0 } : { ...styles.textInput, borderBottomRightRadius: 0, borderTopRightRadius: 0 }}
                        onFocus={() => setStartdateFocus(true)}
                        onBlur={() => setStartdateFocus(false)}
                      />
                      <TouchableOpacity onPress={() => setStartPicker(true)} style={{ ...styles.button, backgroundColor: '#F5C115', borderBottomLeftRadius: 0, borderTopLeftRadius: 0, paddingHorizontal: 22, paddingVertical: 0, justifyContent: 'center' }}>
                        <Image source={require('../assets/cal.png')} style={{}} />
                        {/* <Text style={{color: '#FFF'}}>Select</Text> */}
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
                  </View>
                </View>

                {/* Images */}
                <View style={styles.section}>
                  <Text style={styles.header}>UPLOAD IMAGES</Text>
                  <View style={styles.subsection}>
                    <View style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0, height: 180, borderRadius: 8, padding: 4, backgroundColor: '#FEFAE0' }}>
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
                    </View>
                    <TouchableOpacity style={{ ...styles.button, borderTopLeftRadius: 0, borderTopRightRadius: 0, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 22, paddingVertical: 8, justifyContent: 'center', gap: 12 }} onPress={() => {
                      setShowAddImage(true)
                    }}>
                      <Image source={require('../assets/up.png')} style={{}} />
                      <Text style={{ color: '#E8E7E7', fontSize: 18 }}>Add image</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Bottombutton */}
                <View style={{ ...styles.section, marginBottom: 32, paddingTop: 14 }}>
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity style={{
                      ...styles.button,
                      backgroundColor: '#FFF',
                      borderWidth: 1,
                      borderColor: '#4DAF50',
                      ...styles.buttonTwo
                    }} onPress={() => setIsNext(true)}>
                      <Text style={{ color: '#4DAF50', fontSize: 16 }}>Next</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </>
          }
        </ScrollView>
      </View>
      {saving && <ActivityIndicator color='#FF5733' size='large' style={styles.loading} />}
      <Modal animationType='fade' visible={showAddImage} transparent={true}>
        <View style={styles.addImage}>
          <View style={styles.modalContainer}>

            <TouchableOpacity style={styles.cam} onPress={() => {
              openGallery()
            }}>
              <Image source={require('../assets/gallery.png')} style={{ width: 42, height: 42 }} />
              <Text>Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cam} onPress={() => {
              openCamera()
            }}>
              <Image source={require('../assets/upload.png')} style={{ width: 42, height: 42 }} />
              <Text>Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cam} onPress={() => {
              setShowAddImage(!showAddImage)
            }}>
              <Image source={require('../assets/close.png')} style={{ width: 42, height: 42 }} />
              <Text>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    // paddingHorizontal: 14,
  },
  section: {
    // backgroundColor: 'red',
    paddingTop: 32,
    paddingBottom: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 16,
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
  },
  scroll: {
    flex: 1,
    paddingBottom: 12,
  },
  subsection: {
    marginBottom: 22,
  },
  header: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4DAF50',
    marginBottom: 14,
  },
  subHeader: {
    color: '#5E5E5E',
    marginBottom: 30,
    fontWeight: '500',
    fontSize: 14,
  },
  textInput: {
    flex: 1,
    height: 46,
    opacity: 1.0,
    borderColor: '#E8E7E7',
    borderWidth: 1,
    backgroundColor: '#FBFBFB',
    borderRadius: 8,
    paddingHorizontal: 18,
    color: '#3C3C3B',
    fontSize: 16,
  },
  textInputFocus: {
    flex: 1,
    height: 46,
    opacity: 1.0,
    borderColor: '#F5C115',
    borderWidth: 1.6,
    backgroundColor: '#FBFBFB',
    borderRadius: 8,
    paddingHorizontal: 18,
    color: '#3C3C3B',
    fontSize: 16,
    shadowColor: "#F5C115",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  supText: {
    color: '#070707',
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4
  },
  divider: {
    borderBottomColor: '#5E5E5E',
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 12
  },
  map: {
    height: 300,
    width: '100%',
  },
  button: {
    backgroundColor: '#4DAF50',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  switches: {
    display: 'flex',
    flexDirection: 'row',
    gap: 32,
    marginTop: 8
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
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 32,
  },
  buttonTwo: {
    paddingHorizontal: 42,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginVertical: 8,
  }
})


