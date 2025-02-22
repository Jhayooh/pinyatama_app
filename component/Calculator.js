import { address } from 'addresspinas';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { GeoPoint, Timestamp, collection, doc, setDoc, updateDoc, addDoc, writeBatch, query, where } from 'firebase/firestore';
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
  Switch,
  SafeAreaView
} from 'react-native';
import { RadioButton } from 'react-native-paper';
import { HeaderBackButton } from '@react-navigation/elements'
import _ from 'lodash'
import { WEATHER_KEY } from '../utils/API_KEY';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { LatLng, LeafletView } from 'react-native-leaflet-view';

// import LeafletMapView from 'react-native-leaflet-map';

import { Dropdown } from 'react-native-element-dropdown';
import { auth, db, storage } from '../firebase/Config';
import { TableBuilder } from './TableBuilder';

const soilType = [
  { label: 'Loam', value: 'Loam' },
  { label: 'Clay', value: 'Clay' },
  { label: 'Sandy', value: 'Sandy' }
]




const npkType = [
  {
    label: "HHS (High, High, Sufficient)",
    value: "HHS",
    data: [
      { N: 40, P: 20, K: 45 },
      { N: 40, P: 0, K: 15 }
    ]
  },
  {
    label: "HMS (High, Medium, Sufficient)",
    value: "HMS",
    data: [
      { N: 40, P: 40, K: 45 },
      { N: 40, P: 0, K: 15 }
    ]
  },
  {
    label: "HLS (High, Low, Sufficient)",
    value: "HLS",
    data: [
      { N: 40, P: 60, K: 45 },
      { N: 40, P: 0, K: 15 }
    ]
  },
  {
    label: "HHD (High, High, Deficient)",
    value: "HHD",
    data: [
      { N: 40, P: 20, K: 225 },
      { N: 40, P: 0, K: 75 }
    ]
  },
  {
    label: "HMD (High, Medium, Deficient)",
    value: "HMD",
    data: [
      { N: 40, P: 40, K: 225 },
      { N: 40, P: 0, K: 75 }
    ]
  },
  {
    label: "HLD (High, Low, Deficient)",
    value: "HLD",
    data: [
      { N: 40, P: 60, K: 225 },
      { N: 40, P: 0, K: 75 }
    ]
  },
  {
    label: "MHS (Medium, High, Sufficient)",
    value: "MHS",
    data: [
      { N: 100, P: 20, K: 45 },
      { N: 100, P: 0, K: 15 }
    ]
  },
  {
    label: "MMS (Medium, Medium, Sufficient)",
    value: "MMS",
    data: [
      { N: 100, P: 40, K: 45 },
      { N: 100, P: 0, K: 15 }
    ]
  },
  {
    label: "MLS (Medium, Low, Sufficient)",
    value: "MLS",
    data: [
      { N: 100, P: 60, K: 45 },
      { N: 100, P: 0, K: 15 }
    ]
  },
  {
    label: "MHD (Medium, High, Deficient)",
    value: "MHD",
    data: [
      { N: 100, P: 20, K: 225 },
      { N: 100, P: 0, K: 75 }
    ]
  },
  {
    label: "MMD (Medium, Medium, Deficient)",
    value: "MMD",
    data: [
      { N: 100, P: 40, K: 225 },
      { N: 100, P: 0, K: 75 }
    ]
  },
  {
    label: "MLD (Medium, Low, Deficient)",
    value: "MLD",
    data: [
      { N: 100, P: 60, K: 225 },
      { N: 100, P: 0, K: 75 }
    ]
  },
  {
    label: "LHS (Low, High, Sufficient)",
    value: "LHS",
    data: [
      { N: 150, P: 20, K: 45 },
      { N: 150, P: 0, K: 15 }
    ]
  },
  {
    label: "LMS (Low, Medium, Sufficient)",
    value: "LMS",
    data: [
      { N: 150, P: 40, K: 45 },
      { N: 150, P: 0, K: 15 }
    ]
  },
  {
    label: "LLS (Low, Low, Sufficient)",
    value: "LLS",
    data: [
      { N: 150, P: 60, K: 45 },
      { N: 150, P: 0, K: 15 }
    ]
  },
  {
    label: "LHD (Low, High, Deficient)",
    value: "LHD",
    data: [
      { N: 150, P: 20, K: 225 },
      { N: 150, P: 0, K: 75 }
    ]
  },
  {
    label: "LMD (Low, Medium, Deficient)",
    value: "LMD",
    data: [
      { N: 150, P: 40, K: 225 },
      { N: 150, P: 0, K: 75 }
    ]
  },
  {
    label: "LLD (Low, Low, Deficient)",
    value: "LLD",
    data: [
      { N: 150, P: 60, K: 225 },
      { N: 150, P: 0, K: 75 }
    ]
  }
];




const buttType = [
  { label: 'Farmer Practice', value: 'Farmer Practice' },
  { label: 'Gap', value: 'Gap' },
]


export const Calculator = ({ navigation }) => {
  const [user] = useAuthState(auth)
  const farmsColl = collection(db, 'farms')
  const [farmsData, farmsLoading, farmsError] = useCollectionData(farmsColl);

  const dataColl = collection(db, 'dataFarm')
  const [dataFarms] = useCollectionData(dataColl);

  const farmerColl = collection(db, 'farmer')
  const [farmerData] = useCollectionData(farmerColl);

  const queryParti = collection(db, 'particulars');
  const [qParti, lParti, eParti] = useCollectionData(queryParti)

  const quertyPine = collection(db, 'pineapple');
  const [qPine, lPine, ePine] = useCollectionData(quertyPine)

  const [startPicker, setStartPicker] = useState(false);
  const [endPicker, setEndPicker] = useState(false);

  const usersCol = collection(db, 'users');
  const [users, loadingUsers] = useCollectionData(usersCol)

  const [showAddImage, setShowAddImage] = useState(false)

  const focusNumplants = useRef(null)
  const focusCropstage = useRef(null)

  const [modalVisible, setModalVisible] = useState(false)

  const apiKey = 'e30a4cb23a6a41028fcbd7df077cde27'
  const custIcon = `https://api.geoapify.com/v1/icon/?type=material&color=%23f6a30b&size=small&icon=grass&iconSize=small&textSize=small&strokeColor=%23f6a30b&noWhiteCircle&apiKey=${apiKey}`


  const getDate = () => {
    let tempDate = date.toString().split(' ');
    return date !== ''
      ? `${tempDate[0]} ${tempDate[1]} ${tempDate[2]} ${tempDate[3]}`
      : '';
  };

  const [text, onChangeText] = useState(0);
  // const [first, setfirst] = useState(second)

  const [munFocus, setMunFocus] = useState(false)
  const [brgyFocus, setBrgyFocus] = useState(false)

  const [indUser, setIndUser] = useState({})

  // data natin
  const [base, setBase] = useState(0)
  const [area, setArea] = useState(0)
  const [cropStage, setCropStage] = useState('vegetative')
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date())
  const [farmName, setFarmName] = useState('')
  const [municipality, setMunicipality] = useState('')
  const [brgyCode, setBrgyCode] = useState(null)
  const [farmerName, setFarmerName] = useState('');
  const [sex, setSex] = useState('Male')
  const [userLocation, setUserLocation] = useState(null);
  const [fieldId, setFieldId] = useState('')
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [images, setImages] = useState([])
  const [uploadedImg, setUploadedImg] = useState([])
  const [npk, setNpk] = useState('')
  const [soil, setSoil] = useState('');
  const [butterballType, setButterballType] = useState('')

  const [fertilizer, setFertilizer] = useState({})
  const [oneSevenData, setOneSevenData] = useState(null);
  const [fourTenData, setFourTenData] = useState(null)
  const [uniqueId, setUniqueId] = useState(0)
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

  const [firstnameError, setFirstnameError] = useState('');
  const [lastnameError, setLastnameError] = useState('');
  const [farmnameError, setFarmnameError] = useState('');
  const [fieldIdError, setFieldIdError] = useState('');

  const [isAddFarm, setIsAddFarm] = useState(false)

  const [mapEvent, setMapEvent] = useState(null)
  const [zoom, setZoom] = useState(12)

  const [weather, setWeather] = useState({
    loading: false,
    current: {},
    forecast: [],
    error: false,
  });

  const capitalize = (str, lower = false) =>
    (lower ? str.toLowerCase() : str).replace(/(?:^|\s|["'([{])+\S/g, match => match.toUpperCase());

  const toDateFunction = (timestamp) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June', 'July',
      'August', 'September', 'October', 'November', 'December',
    ];
    const weekDays = [
      'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday',
      'Friday', 'Saturday',
    ];
    const dateObj = timestamp ? new Date(timestamp * 1000) : new Date();
    const dayOfWeek = weekDays[dateObj.getDay()];
    const day = dateObj.getDate();
    const month = months[dateObj.getMonth()];
    const year = dateObj.getFullYear();
    return `${dayOfWeek}, ${day} ${month} ${year}`;
  };

  useEffect(() => {
    navigation.setOptions({
      headerLeft: (props) => (
        <HeaderBackButton
          {...props}
          onPress={() => isNext ? setIsNext(false) : navigation.goBack()}
        />
      ),
      headerRight: () => (
        !isNext && <Button color='orange' title={isAddFarm ? 'Cancel' : 'Add New Farm'} onPress={() => { setIsAddFarm(!isAddFarm) }} />
      )
    });
  }, [isNext, isAddFarm])

  useEffect(() => {
    if (!lastname) return
    if (isAddFarm) {
      setFieldId(lastname + uniqueId)
    }
  }, [lastname])

  function uniqueID() {
    return Math.floor(Math.random() * Date.now())
  }

  function GetIndObj(object, id, key) {
    return object.filter((obj) => {
      return obj[key] === id;
    });
  }

  useEffect(() => {
    if (!users) return
    const io = GetIndObj(users, user.uid, 'id')
    setIndUser(io[0])
  }, [users])


  useEffect(() => {
    if (!isAddFarm) return

    const idid = '-FID' + uniqueID()
    setUniqueId(idid);
    setFieldId(idid);
    setMunicipality(indUser.mun)
    setBrgyCode(indUser.brgy)
    setFarmName('')
    setFirstname('')
    setLastname('')
    setSex('Male')

    let newMun = ""

    if (indUser.mun.toLowerCase().includes("daet")) {
      newMun = "daet";
    } else if (indUser.mun.toLowerCase().includes("san lorenzo ruiz")) {
      newMun = "san lorenzo ruiz";
    } else {
      newMun = indUser.mun
    }

    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${capitalize(newMun)},Camarines Norte,PH&appid=${WEATHER_KEY}`)
      .then(response => response.json())
      .then(json => {
        setUserLocation(new GeoPoint(json[0].lat, json[0].lon))
      }).catch(e => {
        console.log("error fetching lat and lng", e)
      })

  }, [isAddFarm])

  useEffect(() => {
    if (!userLocation) return

    fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${userLocation.latitude}&lon=${userLocation.longitude}&APPID=${WEATHER_KEY}&units=metric`)
      .then((res) => res.json())
      .then((data) => {
        setWeather((prev) => ({
          ...prev,
          current: data
        }));
      })
      .catch((err) => {
        console.log("error", err);
      });

    fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${userLocation.latitude}&lon=${userLocation.longitude}&appid=${WEATHER_KEY}&units=metric`)
      .then((res) => res.json())
      .then((data) => {
        const dailyForecast = data.list.filter(item => new Date(item.dt_txt).getHours() === 12);
        setWeather((prev) => ({
          ...prev,
          forecast: dailyForecast
        }));
      })
      .catch((error) => {
        console.log("error sa forecast:", error)
      })

  }, [userLocation]);

  const addImage = (image, height, width) => {
    setImages(images => [...images, { url: image, height: height, width: width }])
  }

  const openGallery = async () => {
    try {

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: .6,
        allowsEditing: true,
        aspect: [3, 2]
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
        quality: .6,
        allowsEditing: true,
        aspect: [3, 2]
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
      const response = await fetch(uri);
      const blob = await response.blob();
      const filename = uri.substring(uri.lastIndexOf('/') + 1);

      const storageRef = ref(storage, `FarmImages/${newFarm}/${filename}`);
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
          }).catch((error) => {
            console.error("Error getting download URL: ", error);
          });
        }
      );

    } catch (error) {
      console.error("Error uploading image: ", error);
    }
  };

  function goBack () {
    navigation.goBack()
  }

  const saveInputs = async () => {
    try {
      const batch = writeBatch(db);
      const currDate = new Date();

      // Add newAccount and get its ID
      const newAccountRef = await addDoc(farmerColl, {
        firstname,
        lastname,
        sex,
        farmName,
      });
      const newAccountId = newAccountRef.id;
      batch.update(newAccountRef, { id: newAccountId });

      // Set data in dataColl
      const dataDocRef = doc(dataColl, fieldId);

      batch.set(dataDocRef, {
        fieldId,
        farmName,
        farmerId: newAccountId,
        mun: municipality,
        brgy: brgyCode,
      });

      const start_date = new Date(Date.parse(startDate));
      const floweringDate = new Date(start_date);
      floweringDate.setMonth(start_date.getMonth() + 12);
      const fruitingDate = new Date(floweringDate);
      fruitingDate.setMonth(floweringDate.getMonth() + 1);
      const harvestDate = new Date(fruitingDate);
      harvestDate.setMonth(fruitingDate.getMonth() + 5);
      const endDate = new Date(harvestDate)
      endDate.setDate(harvestDate.getDate() + 15)

      const newFarmRef = await addDoc(farmsColl, {
        area: area.toFixed(2),
        brgy: brgyCode,
        cropStage,
        start_date,
        endOfVegetative: floweringDate,
        endOfFlowering: fruitingDate,
        harvest_date: harvestDate,
        geopoint: userLocation,
        mun: municipality,
        title: farmName,
        remarks: 'On going',
        plantNumber: base,
        brgyUID: user.uid,
        farmerName: `${firstname} ${lastname}`,
        sex,
        fieldId,
        farmerId: newAccountId,
        npk,
        soil,
        ethrel: 0,
        isEthrel: null,
        data: fertilizer.data,
        roi: [
          { ...roiDetails, type: 'p' },
          { ...roiDetails, type: 'a' },
        ],
      });
      const newFarmId = newFarmRef.id;

      batch.update(newFarmRef, { id: newFarmId });

      const eventsRef = collection(db, `farms/${newFarmId}/events`);
      const stages = [
        { title: 'Vegetative', start: start_date, end: floweringDate, className: 'vegetative' },
        { title: 'Flowering', start: floweringDate, end: fruitingDate, className: 'flowering' },
        { title: 'Fruiting', start: fruitingDate, end: harvestDate, className: 'fruiting' },
        { title: 'Harvesting', start: harvestDate, end: endDate, className: 'harvesting' },
      ];
      stages.forEach(async ({ title, start, end, className }) => {
        const eventRef = await addDoc(eventsRef, {
          group: newFarmId,
          title,
          className,
          start_time: Timestamp.fromDate(start),
          end_time: Timestamp.fromDate(end),
          createdAt: currDate,
        });
        batch.update(eventRef, { id: eventRef.id });
      });

      // Add each component to farmComp collection
      const farmComp = collection(db, `farms/${newFarmId}/components`);
      await Promise.all(
        components.map(async (component) => {
          const newComp = await addDoc(farmComp, component);
          batch.update(newComp, { id: newComp.id });
        })
      );

      // Commit the batch
      await batch.commit();

      // Upload images
      await Promise.all(images.map((img) => uploadImages(img.url, 'Image', newFarmId)));

      Alert.alert(`Saved Successfully`, `${farmName} is saved.`, [
        {
          text: 'Ok',
          onPress: () => {
            setSaving(false);
            goBack();
          },
        },
      ]);
    } catch (e) {
      console.error('Error in saveInputs:', e.message, e.stack);
    }
  };


  const BottomButton = () => {
    const checkMissing = () => {
      if (!base) {
        Alert.alert('Kinakailangang punan ang patlang na ito', 'Maglagay ng bilang ng tanim.', [
          {
            text: 'Ok',
            onPress: () => { focusNumplants.current.focus() },
            style: 'cancel'
          }
        ])
        return
      }
      if (!table) {
        Alert.alert('Kinakailangang punan ang patlang na ito', 'Kalkyuladuhin ang bilang ng tanim.', [
          {
            text: 'Ok',
            onPress: () => { focusNumplants.current.focus() },
            style: 'cancel'
          }
        ])
        return
      }
      if (!cropStage) {
        Alert.alert('Kinakailangang punan ang patlang na ito', 'Maglagay ng yugto ng tanim.', [
          {
            text: 'Ok',
            onPress: () => { focusNumplants.current.focus() },
            style: 'cancel'
          }
        ])
        return
      }
      if (!firstname) {
        Alert.alert('Kinakailangang punan ang patlang na ito', 'Maglagay ng pangalan ng magsasaka', [
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

    const confirmSave = () => {
      Alert.alert(`Confirm`, `Do you want to save ${farmName}?`, [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'YES',
          onPress: () => {
            setSaving(true)
            saveInputs()
          }
        },
      ]);
    }

    return (
      <>
        <TouchableOpacity style={{
          ...styles.button,
          ...styles.buttonTwo
        }} onPress={checkMissing}>
          <Text style={{ color: '#fff', fontSize: 16 }}>SAVE</Text>
        </TouchableOpacity>

      </>
    )
  }

  const getMult = (numOne, numTwo) => {
    const num = numOne * numTwo
    return Math.round(num * 10) / 10
  }

  // start of fertilizer optimizations
  function getFunction(N, P, K, fertilizerOptions) {
    const nonZeroNPK = [N, P, K].filter(v => v > 0);

    const lowest = Math.min(...nonZeroNPK);
    const field = (lowest === N) ? 'N' : (lowest === P) ? 'P' : 'K';

    const needFert = fertilizerOptions.filter(fertilizer => fertilizer[field] !== 0);

    return {
      lowest,
      field,
      fertilizers:
        needFert,
    };
  }

  function getAmount(num) {
    const bag = getMult(area, (num / 50) / 2);
    return Math.round(bag * 100) / 100;
  }

  function formatNum(number) {
    return Math.round(number * 100) / 100;
  }

  function getPrice(fertName) {
    const fert = qParti.find(obj => obj.name.includes(fertName));
    console.log("the fert issss", fert)
    return fert ? { ...fert, foreignId: fert.id } : null
  }

  function getFertValue(N, P, K, fertilizerOptions) {
    let options = [];
    const { lowest, field, fertilizers } = getFunction(N, P, K, fertilizerOptions);

    for (const f1 of fertilizers) {
      let n1 = N;
      let p1 = P;
      let k1 = K;

      const percent1 = f1[field] / 100;
      const amount1 = (lowest / percent1);

      n1 = n1 - (amount1 * (f1.N / 100));
      p1 = p1 - (amount1 * (f1.P / 100));
      k1 = k1 - (amount1 * (f1.K / 100));

      const need1 = getFunction(n1, p1, k1, fertilizerOptions);
      const lowest1 = need1.lowest;
      const field1 = need1.field;
      const fertilizers1 = need1.fertilizers.filter(f => f.name !== f1.name);

      const amnt1 = Math.max(0, getAmount(amount1));
      const fertObj1 = getPrice(f1.name)
      if (fertObj1 === null) {
        continue
      }
      const price1 = fertObj1.price
      const totalPrice1 = price1 * amnt1;

      if (n1 <= 0 && p1 <= 0 && k1 <= 0) {
        const len = options.length;
        options.push(
          [{
            ...fertObj1,
            qntyPrice: amnt1,
            price: formatNum(price1),
            totalPrice: formatNum(totalPrice1),
          }]);
        continue;
      }

      for (const f2 of fertilizers1) {
        let n2 = n1;
        let p2 = p1;
        let k2 = k1;

        const percent2 = f2[field1] / 100;
        const amount2 = lowest1 / percent2;

        n2 = n2 - (amount2 * (f2.N / 100));
        p2 = p2 - (amount2 * (f2.P / 100));
        k2 = k2 - (amount2 * (f2.K / 100));

        const need2 = getFunction(n2, p2, k2, fertilizerOptions);
        const lowest2 = need2.lowest;
        const field2 = need2.field;
        const fertilizers2 = need2.fertilizers.filter(f => f.name !== f1.name && f.name !== f2.name);

        const amnt2 = Math.max(0, getAmount(amount2));
        const fertObj2 = getPrice(f2.name)
        if (fertObj2 === null) {
          continue
        }
        const price2 = fertObj2.price
        const totalPrice2 = price2 * amnt2;

        if (n2 <= 0 && p2 <= 0 && k2 <= 0) {
          options.push(
            [{
              ...fertObj1,
              qntyPrice: amnt1,
              price: formatNum(price1),
              totalPrice: formatNum(totalPrice1)
            },
            {
              ...fertObj2,
              qntyPrice: amnt2,
              price: formatNum(price2),
              totalPrice: formatNum(totalPrice2)
            }]);
          continue;
        }
        for (const f3 of fertilizers2) {
          const len = options.length;
          let n3 = n2;
          let p3 = p2;
          let k3 = k2;

          const percent3 = f3[field2] / 100;
          const amount3 = lowest2 / percent3;

          n3 = n3 - (amount3 * (f3.N / 100));
          p3 = p3 - (amount3 * (f3.P / 100));
          k3 = k3 - (amount3 * (f3.K / 100));

          const amnt3 = Math.max(0, getAmount(amount3));
          const fertObj3 = getPrice(f3.name)
          if (fertObj3 === null) {
            continue
          }
          const price3 = fertObj3.price
          const totalPrice3 = amnt3 * price3;

          options.push(
            [{
              ...fertObj1,
              qntyPrice: amnt1,
              price: formatNum(price1),
              totalPrice: formatNum(totalPrice1)
            },
            {
              ...fertObj2,
              qntyPrice: amnt2,
              price: formatNum(price2),
              totalPrice: formatNum(totalPrice2)
            },
            {
              ...fertObj3,
              qntyPrice: amnt3,
              price: formatNum(price3),
              totalPrice: formatNum(totalPrice3),
            }])
        }
      }
    }

    const sortedOptions = options.sort((a, b) => {
      const sumA = a.reduce((sum, fert) => sum + fert.totalPrice, 0);
      const sumB = b.reduce((sum, fert) => sum + fert.totalPrice, 0);
      return sumA - sumB;
    }).slice(0, 5);

    return sortedOptions;
  }

  function loopNPK(npks) {
    const [npk1, npk2] = npks;

    const fertilizersOne = [
      { name: '16-20-0', N: 16, P: 20, K: 0 },
      { name: '46-0-0', N: 46, P: 0, K: 0 },
      { name: '0-0-60', N: 0, P: 0, K: 60 },
      { name: '14-14-14', N: 14, P: 14, K: 14 },
      { name: '21-0-0', N: 21, P: 0, K: 0 },
      { name: '17-0-17', N: 17, P: 0, K: 17 },
    ];

    const oneAndSeven = getFertValue(npk1.N, npk1.P, npk1.K, fertilizersOne);
    const fourAndTen = getFertValue(npk2.N, npk2.P, npk2.K, fertilizersOne);

    const oneSeven = oneAndSeven.map((i, idx) => {
      console.log(`oneSeven ${idx}: ${JSON.stringify(i, null, 2)}`)
      return {
        option: `Optimal Cost ${idx + 1}`,
        value: idx,
        data: i
      }
    })
    const fourTen = fourAndTen.map((i, idx) => {
      console.log(`fourTen ${idx}: ${JSON.stringify(i, null, 2)}`)
      return {
        option: `Optimal Cost ${idx + 1}`,
        value: idx,
        data: i
      }
    })


    setOneSevenData(oneSeven);
    setFourTenData(fourTen);
  }

  const handleBase = () => {
    const baseValue = parseFloat(base);

    if (baseValue === 0) {
      return;
    }

    const fertilizers = npkType.find((npkItem) => npkItem.value === npk)
    loopNPK(fertilizers.data)

    const newComponents = qParti
      ?.flatMap(item => {
        if (item.parent.toLowerCase() !== 'fertilizer') {
          const newQnty = getMult(area, item.defQnty);
          return [{
            ...item,
            qntyPrice: newQnty,
            totalPrice: getMult(newQnty, item.price),
            price: parseInt(item.price),
            foreignId: item.id,
            type: item.id === '26nzrfWyeWAPHriACtP4' ? 'p' : 'b'
          }];
        }
      })
      .filter(Boolean);

    setComponents(newComponents);
    setTable(true);
    setCalculating(false);
  };

  function handleNext() {
    if (!firstname) {
      Alert.alert('Farmer Name', 'Maglagay ng pangalan ng magsasaka')
      return
    }

    if (!lastname) {
      Alert.alert('Farmer Lastname', 'Maglagay ng pangalan ng magsasaka')
      return
    }

    if (!farmName) {
      Alert.alert('Farm Name', 'Maglagay ng pangalan ng bukid')
      return
    }

    if (!fieldId) {
      Alert.alert('Field ID', 'Maglagay ng Field ID')
      return
    }

    if (images.length===0){
      Alert.alert('Imahe','Maglagay ng imahe ng bukid')
      return
    }

    setIsNext(true)
  }

  const deleteLastImage = () => {
    if (images.length > 0) {
      const updatedImages = [...images];
      updatedImages.pop();
      setImages(updatedImages);
    }
  };

  const fieldIdChange = (e) => {
    setFieldId(e.fieldId)
    const f = farmerData?.find(fd => fd.id === e.farmerId)

    if (f) {
      setFarmName(f.farmName)
      setFirstname(f.firstname)
      setLastname(f.lastname)
      setSex(f.sex)
    }
    setMunicipality(e.mun)
    setBrgyCode(e.brgy)
    setFieldidFocus(false)
    // setUserLocation(f['Geopoint'])

    // Index: 0
    // Area: 1.00
    // Barangay: Iraya Sur
    // Barangay UID: oYKtMJrkXkdxy3EQERUSBFRh6WO2
    // Crop Stage: Complete
    // Farmer Name: Arnina Baisa
    // Field ID: Baisa - 6382
    // Geopoint: Latitude: 14.1098492, Longitude: 14.1098492
    // Harvest Date: July 18, 2024(UTC)
    // ID: 0ScZaSJMaW4v680w28pj
    // Municipality: San Vicente
    // Plant Number: 30000
    // Sex: Female
    // Start Date: January 17, 2023(UTC)
    // Title: Baisa QP Farm

    // fieldId,
    // farmName,
    // farmerId: newAccount.id

    // firstname,
    // lastname,
    // sex,
    // farmName,

    // if (!farmerData) return
  }

  const getDayOfWeek = (timestamp) => {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const date = new Date(timestamp * 1000); // Convert from seconds to milliseconds
    return daysOfWeek[date.getDay()]; // Get day of the week as a string
  };

  function normalizeLongitude(lng) {
    return ((lng + 180) % 360 + 360) % 360 - 180;
  }

  function reverseNormalizeLongitude(lng) {
    return lng > 0 ? lng - 360 : lng; // Adjusting for positive longitudes
  }


  return (
    <>
      <View style={styles.screen}>
        <ScrollView style={styles.scroll}>
          {
            isNext ?
              <>
                {/* <View style={{ ...styles.section, paddingHorizontal: 8 }}>
                  <Text style={styles.header}>WEATHER</Text>
                  <View style={styles.subsection}>
                    {weather.loading && (
                      <ActivityIndicator />
                    )}
                    {weather.current.main && (
                      <>
                        <View style={styles.weatherCurrent}>
                          <View style={styles.weatherCurrentMain}>
                            <View style={{ display: 'flex', flexDirection: 'row', flex: 1 }}>
                              <Image
                                style={{ width: 25, height: 25 }}
                                source={{
                                  uri: `https://openweathermap.org/img/wn/${weather.current.weather[0].icon}@2x.png`,
                                }}
                              />
                              <Text style={{ fontSize: 25, fontFamily: 'serif' }}> {weather.current.main.temp}&deg;C</Text>
                            </View>
                            <Text style={{ fontSize: 15, fontFamily: 'serif' }}>{capitalize(weather.current.weather[0].description)}</Text>
                          </View>
                          <View style={{ ...styles.weatherCurrDetails, borderRadius: 20, backgroundColor: '#E7F3E7', marginBottom: 5, marginTop: 5, padding: 15 }}>
                            <View style={styles.weatherChild}>
                              <View>
                                <Text>
                                  Feels
                                </Text>
                                <Text>
                                  {weather.current.main.feels_like}&deg;C
                                </Text>
                              </View>
                              <View>
                                <Text>
                                  Low
                                </Text>
                                <Text>
                                  {weather.current.main.temp_min}&deg;C
                                </Text>
                              </View>
                              <View>
                                <Text>
                                  High
                                </Text>
                                <Text>
                                  {weather.current.main.temp_max}&deg;C
                                </Text>
                              </View>
                            </View>
                            <View style={styles.weatherChild}>
                              <View>
                                <Text>
                                  Wind
                                </Text>
                                <Text>
                                  {weather.current.wind.speed} m/s
                                </Text>
                              </View>
                              <View>
                                <Text>
                                  Humidity
                                </Text>
                                <Text>
                                  {weather.current.main.humidity}%
                                </Text>
                              </View>
                              <View>
                                <Text>
                                  Rain
                                </Text>
                                <Text>
                                  {weather.current.rain ? weather.current.rain['1h'] : 'N/A'} mm
                                </Text>
                              </View>
                            </View>
                          </View>
                        </View>
                        <View style={styles.weatherForecast}>
                          {weather.forecast.map((day, index) => (
                            <View key={index} style={{ ...styles.forecastChild, borderRadius: 10, backgroundColor: '#E7F3E7', marginBottom: 5, marginTop: 5, padding: 15, }}>
                              <Text style={{ fontFamily: 'serif', justifyContent: 'flex-start' }}>
                                {getDayOfWeek(day.dt)}
                              </Text>
                              <View style={{ display: 'flex', flexDirection: 'row', flex: 1, justifyContent: 'center' }}>
                                <Image
                                  style={{ width: 25, height: 25 }}
                                  source={{
                                    uri: `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`,
                                  }}
                                />
                                <Text>{capitalize(day.weather[0].description)}</Text>
                              </View>
                              <View>
                                <Text style={{ fontSize: 20 }}>{day.main.temp}&deg;C</Text>
                                <Text style={{ color: 'gray' }}>Feels {day.main.feels_like}&deg;C</Text>
                              </View>
                            </View>
                          ))}
                        </View>
                      </>
                    )}
                  </View>
                </View> */}
                <View style={{ ...styles.section, marginHorizontal: table ? 0 : 14, paddingHorizontal: 8 }}>
                  <Text style={styles.header}>KALKULAHIN</Text>
                  <View style={styles.subsection}>
                    <Text style={styles.supText}>Nitrogen (N), Phosphorus (P), and Potassium (K)</Text>
                    <View style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
                      <Dropdown
                        data={npkType}
                        labelField='label'
                        valueField='value'
                        placeholder='Pumili ng NPK'
                        value={npk}
                        onChange={item => {
                          setTable(false)
                          setFertilizer(item)
                          setNpk(item.value)
                        }}
                        style={{ ...styles.textInput, borderBottomRightRadius: 0, borderTopRightRadius: 0 }}
                      />
                    </View>
                  </View>
                  <View style={styles.subsection}>
                    <Text style={styles.supText}>Klase ng Lupa</Text>
                    <View style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
                      <Dropdown
                        data={soilType}
                        labelField='label'
                        valueField='value'
                        placeholder='Pumili ng klase ng lupa'
                        value={soil}
                        onChange={item => {
                          setTable(false)
                          setSoil(item.value);
                        }}
                        style={{ ...styles.textInput, borderBottomRightRadius: 0, borderTopRightRadius: 0 }}
                      />
                    </View>
                  </View>
                  <View style={styles.subsection}>
                    <Text style={styles.supText}>Bilang ng Tanim</Text>
                    <View style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
                      <TextInput
                        editable
                        onChangeText={(base) => {
                          setBase(base)
                          setArea(base / 30000)
                          setTable(false)
                        }}
                        ref={focusNumplants}
                        placeholder='Maglagay ng bilang ng Tanim'
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
                          }
                          } style={{ ...styles.button, backgroundColor: '#F5C115', borderBottomLeftRadius: 0, borderTopLeftRadius: 0, paddingHorizontal: 22, paddingVertical: 0, justifyContent: 'center' }}>
                            <Text> Kalkulahin </Text>
                          </TouchableOpacity>

                      }
                    </View>
                    {table && qPine && oneSevenData && fourTenData && <TableBuilder
                      components={components}
                      area={area}
                      setRoiDetails={setRoiDetails}
                      pineapple={qPine}
                      setComponents={setComponents}
                      fertilizers={fertilizer}
                      soil={soil}
                      bbType={butterballType}
                      oneSeven={oneSevenData}
                      fourTen={fourTenData}
                    />}
                  </View>

                </View>
                <View style={{ margin: 5 }} >
                  <View style={{ ...styles.buttonContainer }}>
                    {table && <BottomButton />}
                  </View>
                </View>
              </> :
              <>
                {/* Farm Location */}
                <View style={styles.section}>
                  <Text style={styles.header}>FARM INFORMATION</Text>
                  <View style={styles.subsection}>
                    <View style={{ flexDirection: 'row', gap: 1 }}>
                      <Text style={styles.supText}>Field ID</Text>
                      <Text style={{ color: 'red' }}>*</Text>
                    </View>
                    {
                      isAddFarm ?
                        <>
                          <TextInput
                            editable={false}
                            maxLength={40}
                            onChangeText={(text) => {
                              setFieldId(text);
                              if (text.trim() === '') {
                                setFieldIdError('Kinakailangang punan ang patlang na ito');
                              } else {
                                setFieldIdError('');
                              }
                            }}
                            placeholder='Field ID'
                            value={fieldId}
                            style={fieldidFocus ? styles.textInputFocus : styles.textInput}
                            onFocus={() => setFieldidFocus(true)}
                            onBlur={() => setFieldidFocus(false)}
                          />
                          {fieldIdError ? <Text style={{ color: 'red', fontSize: 12 }}>{fieldIdError}</Text> : null}
                        </>
                        :
                        <Dropdown
                          search
                          data={dataFarms && indUser ? dataFarms.filter(df => df.mun === indUser.mun && df.brgy === indUser.brgy) : []}
                          labelField='fieldId'
                          valueField='fieldId'
                          onChange={fieldIdChange}
                          placeholder={!fieldidFocus ? 'Pumili ng Field ID' : fieldId}
                          searchPlaceholder="Maghanap..."
                          value={fieldId}
                          style={fieldidFocus ? styles.textInputFocus : styles.textInput}
                          onFocus={() => setFieldidFocus(true)}
                          onBlur={() => setFieldidFocus(false)}
                        />
                    }
                  </View>
                  <View style={styles.subsection}>
                    <View style={{ flexDirection: 'row', gap: 1 }}>
                      <Text style={styles.supText}>Pangalan ng Bukid</Text>
                      <Text style={{ color: 'red' }}>*</Text>
                    </View>
                    <TextInput
                      editable={isAddFarm}
                      maxLength={40}
                      onChangeText={(text) => {
                        setFarmName(text);
                        if (text.trim() === '') {
                          setFarmnameError('Kinakailangang punan ang patlang na ito');
                        } else {
                          setFarmnameError('');
                        }
                      }}
                      placeholder='Maglagay ng Pangalan ng Bukid'
                      value={farmName}
                      style={farmnameFocus ? styles.textInputFocus : styles.textInput}
                      onFocus={() => setFarmnameFocus(true)}
                      onBlur={() => setFarmnameFocus(false)}
                      require
                    />
                    {farmnameError ? <Text style={{ color: 'red', fontSize: 12 }}>{farmnameError}</Text> : null}
                  </View>
                  <View style={styles.subsection}>
                    <View style={{ flexDirection: 'row', gap: 1 }}>
                      <Text style={styles.supText}>Munisipalidad</Text>
                      <Text style={{ color: 'red' }}>*</Text>
                    </View>
                    <TextInput
                      editable={false}
                      maxLength={40}
                      placeholder='Piliin ang Munisipalidad'
                      value={municipality}
                      style={styles.textInput}
                    />
                  </View>
                  <View style={styles.subsection}>
                    <View style={{ flexDirection: 'row', gap: 1 }}>
                      <Text style={styles.supText}>Baranggay</Text>
                      <Text style={{ color: 'red' }}>*</Text>
                    </View>
                    <TextInput
                      maxLength={40}
                      disabled={false}
                      placeholder='Piliin ang Baranggay'
                      value={brgyCode}
                      style={styles.textInput}
                    />
                  </View>
                  <View style={styles.subsection}>
                    <View style={{ flexDirection: 'row', gap: 1 }}>
                      <Text style={styles.supText}>Lokasyon</Text>
                      <Text style={{ color: 'red' }}>*</Text>
                    </View>
                    <View >
                      <Button color='green' onPress={() => setModalVisible(true)} title="Buksan ang Mapa" />
                      <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => {
                          setModalVisible(!modalVisible);
                        }}>
                        <View
                          style={{
                            flex: 1,
                          }}
                        >
                          <View style={{
                            flex: 1,
                            borderWidth: 1,
                            borderColor: '#fff'
                          }}>

                            <LeafletView
                              mapMarkers={[
                                {
                                  position: userLocation
                                    ? { lat: userLocation.latitude, lng: reverseNormalizeLongitude(userLocation.longitude) }
                                    // : mapEvent
                                    //   ? { lat: mapEvent.lat, lng: mapEvent.lng }
                                    : { lat: 14.192259401369892, lng: -237.2101928677876 },
                                  icon: custIcon,
                                  size: [28, 40],
                                },
                              ]}
                              onMessageReceived={(e) => {
                                if (e.event === "onMapClicked") {
                                  setUserLocation(new GeoPoint(e.payload.touchLatLng.lat, normalizeLongitude(e.payload.touchLatLng.lng)))
                                }
                                if (e.event === "onZoomEnd") {

                                  setZoom(e.payload.zoom)
                                }
                              }}
                              mapCenterPosition={
                                userLocation
                                  ? { lat: userLocation.latitude, lng: reverseNormalizeLongitude(userLocation.longitude) }
                                  // : mapEvent
                                  //   ? { lat: mapEvent.lat, lng: mapEvent.lng }
                                  : { lat: 14.192259401369892, lng: -237.2101928677876 }
                              }
                              zoom={zoom}
                            />

                          </View>
                          <View style={{ flexDirection: 'row', justifyContent: 'space-between', display: 'flex', width: '100%' }}>
                            <TouchableOpacity
                              style={{ backgroundColor: 'red', padding: 10, flex: 1, alignItems: 'center' }}
                              onPress={() => setModalVisible(false)}
                            >
                              <Text style={{ color: 'white', fontFamily: 'serif', fontSize: 20 }}>Kanselahin</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                              style={{ backgroundColor: 'green', padding: 10, flex: 1, alignItems: 'center' }}
                              onPress={() => setModalVisible(false)}
                            >
                              <Text style={{ color: 'white', fontFamily: 'serif', fontSize: 20 }}>Ok</Text>
                            </TouchableOpacity>
                          </View>

                        </View>

                      </Modal>
                      {/* <MapView
                        provider={PROVIDER_GOOGLE}
                        style={styles.map} region={region} onPress={handleMapPress}>
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
                      </MapView> */}
                    </View>
                  </View>
                </View>

                {/* Farmer Detail */}
                <View style={styles.section}>
                  <Text style={styles.header}>DETALYE NG MAGSASAKA</Text>
                  <View style={styles.subsection}>
                    <View style={{ flexDirection: 'row', gap: 1 }}>
                      <Text style={styles.supText}>Pangalan</Text>
                      <Text style={{ color: 'red' }}>*</Text>
                    </View>
                    <TextInput
                      editable={isAddFarm}
                      maxLength={40}
                      onChangeText={(text) => {
                        setFirstname(text);
                        if (text.trim() === '') {
                          setFirstnameError('Kinakailangang punan ang patlang na ito');
                        } else {
                          setFirstnameError('');
                        }
                      }}
                      placeholder='Illagay ang Pangalan'
                      value={firstname}
                      style={firstnameFocus ? styles.textInputFocus : styles.textInput}
                      onFocus={() => setFirstnameFocus(true)}
                      onBlur={() => setFirstnameFocus(false)}
                    />
                    {firstnameError ? <Text style={{ color: 'red', fontSize: 12 }}>{firstnameError}</Text> : null}
                  </View>
                  <View style={styles.subsection}>
                    <View style={{ flexDirection: 'row', gap: 1 }}>
                      <Text style={styles.supText}>Apelyido</Text>
                      <Text style={{ color: 'red' }}>*</Text>
                    </View>
                    <TextInput
                      editable={isAddFarm}
                      maxLength={40}
                      onChangeText={(text) => {
                        setLastname(text);
                        if (text.trim() === '') {
                          setLastnameError('Kinakailangang punan ang patlang na ito');
                        } else {
                          setLastnameError('');
                        }
                      }}
                      placeholder='Ilagay ang Apelyido'
                      value={lastname}
                      style={lastnameFocus ? styles.textInputFocus : styles.textInput}
                      onFocus={() => setLastnameFocus(true)}
                      onBlur={() => setLastnameFocus(false)}
                    />
                    {lastnameError ? <Text style={{ color: 'red', fontSize: 12 }}>{lastnameError}</Text> : null}
                  </View>
                  <View style={styles.subsection}>
                    <View style={{ flexDirection: 'row', gap: 1 }}>
                      <Text style={styles.supText}>Kasarian</Text>
                      <Text style={{ color: 'red' }}>*</Text>
                    </View>
                    <View style={styles.switches}>
                      <View style={styles.switchContainer}>
                        <RadioButton.Android
                          value="Male"
                          status={sex === 'Male' ?
                            'checked' : 'unchecked'}
                          onPress={() => setSex('Male')}
                          color="#F5C115"
                        />
                        <Text >Lalaki</Text>
                        {/* <Switch
                          trackColor={{ false: '#E8E7E7', true: '#FCF0C5' }}
                          thumbColor={sex === 'Male' ? '#F5C115' : '#f4f3f4'}
                          ios_backgroundColor="#3e3e3e"
                          onValueChange={switchMale}
                          value={sex === 'Male'}
                        /> */}
                      </View>
                      <View style={styles.switchContainer}>
                        <RadioButton.Android
                          value="Female"
                          status={sex === 'Female' ?
                            'checked' : 'unchecked'}
                          onPress={() => setSex('Female')}
                          color="#F5C115"
                        />
                        <Text >Babae</Text>
                        {/* <Switch
                          trackColor={{ false: '#E8E7E7', true: '#FCF0C5' }}
                          thumbColor={sex === 'Female' ? '#F5C115' : '#f4f3f4'}
                          ios_backgroundColor="#3e3e3e"
                          onValueChange={switchFemale}
                          value={sex === 'Female'}
                        /> */}
                      </View>
                    </View>
                  </View>
                </View>

                {/* farm details */}
                <View style={styles.section}>
                  <Text style={styles.header}>PETSA NG PAGTANIM</Text>
                  <View style={styles.subsection}>
                    <View style={{ flexDirection: 'row', gap: 1 }}>
                      <Text style={styles.supText}>Petsa ng Pagtanim</Text>
                      <Text style={{ color: 'red' }}>*</Text>
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
                      <TextInput
                        value={startDate.toLocaleDateString()}
                        placeholder="Petsa ng Pagtanim"
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
                        maximumDate={new Date()}
                        onConfirm={(date) => {
                          setStartDate(date);
                          setStartPicker(false);
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
                          horizontal={true}
                          renderItem={({ item }) => (
                            <View style={{ flex: 1 }}>
                              <Image style={{ height: '100%', width: 240, borderRadius: 6 }} source={{ uri: item.url }} />
                            </View>
                          )}
                          ItemSeparatorComponent={() =>
                            <View style={{ width: 4, height: '100%' }}></View>
                          }
                        />

                      }
                    </View>
                    <View style={{ flex: 1, gap: 2, flexDirection: 'row', justifyContent: 'space-between' }}>
                      <TouchableOpacity
                        style={{
                          ...styles.button,
                          borderTopLeftRadius: 0,
                          borderTopRightRadius: 0,
                          alignItems: 'center',
                          paddingHorizontal: 22,
                          paddingVertical: 8,
                          width: '100%',
                          flex: 1
                        }}
                        onPress={() => {
                          setShowAddImage(true)
                        }}>
                        <Image source={require('../assets/up.png')} style={{ resizeMode: 'contain' }} />
                        <Text style={{ color: '#E8E7E7', fontSize: 18, }}>Add Image</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{
                          ...styles.button,
                          borderTopLeftRadius: 0,
                          borderTopRightRadius: 0,
                          alignItems: 'center',
                          paddingHorizontal: 22,
                          paddingVertical: 8,
                          width: '100%',
                          flex: 1
                        }}
                        onPress={deleteLastImage}
                      >
                        <Image source={require('../assets/trash.png')} style={{ resizeMode: 'contain' }} />
                        <Text style={{ color: '#E8E7E7', fontSize: 18, }}>Delete Image</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                {/* Bottombutton */}
                <View style={{ marginBottom: 32, paddingTop: 14, marginRight: 15 }}>
                  <View style={{ alignItems: 'flex-end' }}>
                    <TouchableOpacity style={{
                      ...styles.button,
                      backgroundColor: '#FFF',
                      borderWidth: 1,
                      borderColor: '#4DAF50',
                      ...styles.buttonTwo
                    }} onPress={handleNext}>
                      <Text style={{ color: '#4DAF50', fontSize: 16 }}>Next</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </>
          }
        </ScrollView >
      </View >
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
      <Modal animationType='fade' visible={saving} transparent={true}>
        <View style={styles.addImage}>
          <View style={{ ...styles.modalContainer, paddingHorizontal: 28, display: 'flex', paddingVertical: 18 }}>
            <ActivityIndicator size='large' style={{ paddingRight: 0, marginRight: 0 }} />
            <Text>Saving...</Text>
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
    height: '100%',
    padding: 2
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
    // padding: 12,
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
  },
  // weatherCurrent: {

  // },
  // weatherCurrentMain: {
  //   alignItems: 'center'
  // },
  // weatherCurrDetails: {
  //   width: 'auto',
  //   gap: 6,
  //   padding: 8,
  // },
  // weatherChild: {
  //   display: 'flex',
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  // },
  // weatherForecast: {

  // },
  // forecastChild: {
  //   display: 'flex',
  //   justifyContent: 'space-between',
  //   flexDirection: 'row'
  // }
})
