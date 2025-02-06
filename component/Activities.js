import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Alert, Image, ScrollView, } from 'react-native';
import StepIndicator from 'react-native-step-indicator';
import { MultiSelect } from 'react-native-element-dropdown';
import { Dropdown } from 'react-native-element-dropdown';
import moment from 'moment';
import { addDoc, collection, query, orderBy, onSnapshot, Timestamp, updateDoc, doc, writeBatch, arrayUnion } from 'firebase/firestore'; // added onSnapshot
import { db } from '../firebase/Config';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { LinearGradient } from 'expo-linear-gradient';
import CheckBox from 'expo-checkbox'
import { EvilIcons, AntDesign, Entypo } from '@expo/vector-icons';
import dayjs from "dayjs";

// const ferti = [
//   { label: "Ammophos (16-20-0)", value: "Ammophos (16-20-0)" },
//   { label: "Muriate of Potash (0-0-60)", value: "Muriate of Potash (0-0-60)" },
//   { label: "Urea (Granular) (46-0-0)", value: "Urea (Granular) (46-0-0)" },
//   { label: "Ammosul (21-0-0)", value: "Ammosul (21-0-0)" },
//   { label: "Complete (14-14-14)", value: "Complete (14-14-14)" },
//   { label: "Water Soluble Calcium Nitrate (17-0-17)", value: "Water Soluble Calcium Nitrate (17-0-17)" },
//   { label: "Flower Inducer (ethrel)", value: "Flower Inducer (ethrel)" },
// ];

const title = [
  { label: 'Crop Monoculture', value: 'Crop Monoculture' },
  { label: 'Diseases', value: 'Diseases' },
  { label: 'Drought', value: 'Drought' },
  { label: 'Excessive Rainfall', value: 'Excessive Rainfall' },
  { label: 'Extreme Temperatures', value: 'Extreme Temperatures' },
  { label: 'Floods', value: 'Floods' },
  { label: 'Hailstorms', value: 'Hailstorms' },
  { label: 'High Input Costs', value: 'High Input Costs' },
  { label: 'High Salinity', value: 'High Salinity' },
  { label: 'Improper Harvesting', value: 'Improper Harvesting' },
  { label: 'Improper Irrigation', value: 'Improper Irrigation' },
  { label: 'Incorrect Planting Time', value: 'Incorrect Planting Time' },
  { label: 'Labor Shortages', value: 'Labor Shortages' },
  { label: 'Market Limitations', value: 'Market Limitations' },
  { label: 'Pests', value: 'Pests' },
  { label: 'Poor Fertilization', value: 'Poor Fertilization' },
  { label: 'Poor Seed Quality', value: 'Poor Seed Quality' },
  { label: 'Soil Erosion', value: 'Soil Erosion' },
  { label: 'Strong Winds', value: 'Strong Winds' },
  { label: 'Typhoon', value: 'Typhoon' },
  { label: 'Unpredictable Weather Patterns', value: 'Unpredictable Weather Patterns' },
  { label: 'Weeds', value: 'Weeds' },
];


const Activities = ({ route }) => {
  const [farm, setFarm] = useState(route.params.farm)
  const currentMonthDiff = farm.start_date
    ? dayjs().diff(dayjs(farm.start_date.toDate()), "month")
    : 0;

  const componentsColl = collection(db, `farms/${farm.id}/components`)
  const [components] = useCollectionData(componentsColl)

  const farmColl = collection(db, '/farms')
  const [farmData] = useCollectionData(farmColl)

  const particularColl = collection(db, `/particulars`)
  const [parts] = useCollectionData(particularColl)

  const pineappleColl = collection(db, `/pineapple`)
  const [localPine] = useCollectionData(pineappleColl)

  const activityColl = collection(db, `farms/${farm.id}/activities`);
  const activityQuery = query(activityColl, orderBy('createdAt'));

  const roiColl = collection(db, `farms/${farm.id}/roi`)
  const [roi] = useCollectionData(roiColl)

  const eventsColl = collection(db, `farms/${farm.id}/events`)
  const eventsQuery = query(eventsColl, orderBy('createdAt'))
  const [e] = useCollectionData(eventsQuery)

  const [ferti, setFerti] = useState(null)
  const [dd_batches, setDd_batches] = useState([])
  const [batchValue, setBatchValue] = useState(null)

  const [selectedBatch, setSelectedBatch] = useState(null)

  const [dynamicSteps, setDynamicSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAdd, setIsAdd] = useState(false);
  const [report, setReport] = useState(false);
  const [fertilizer, setFertilizer] = useState('');
  const [quantity, setQuantity] = useState('');
  const [saving, setSaving] = useState(false);
  const [events, setEvents] = useState(null)
  const [bilang, setBilang] = useState(0)
  const [qntyPrice, setQntyPrice] = useState(0)

  const [laborMaterial, setLaborMaterial] = useState(null)
  const [actualComponents, setActualComponents] = useState(null)

  const [comps, setComps] = useState({ qntyPrice: 0, foreignId: '' })
  const [reportTitle, setReportTitle] = useState('')
  const [reportDesc, setReportDesc] = useState('')
  const [reportPer, setReportPer] = useState(0);
  const [bilangError, setBilangError] = useState(false)
  const [startPicker, setStartPicker] = useState(false);
  const [date, setDate] = useState(null)

  const [application, setApplication] = useState([])

  const [alert, setAlert] = useState({ visible: false, message: '', severity: '' });

  useEffect(() => {
    if (!e) return
    setEvents(e)
  }, [e])

  useEffect(() => {
    if (farm.batches) {
      const farmBatches = farm.batches
        .filter(f => f.plantSize > 0)
        .map(f => ({
          label: `Batch ${f.index} (${f.plantSize} pcs)`,
          value: f.index,
          ...f
        }));

      setDd_batches(farmBatches);
    }
  }, [farm]);


  useEffect(() => {
    if (parts) {
      const filteredFerti = parts
        .filter((part) => part.parent.toLowerCase() === "fertilizer" && part.isAvailable)
        .map((part) => ({
          isAvailable: part.isAvailable,
          label: part.name,
          value: part.name
        }));

      let ethrelPart = [];

      if (currentMonthDiff >= 8 && currentMonthDiff <= 12 && parseInt(farm.remainingPlant) != 0) {
        ethrelPart = parts
          .filter((part) => part.name.toLowerCase().includes("ethrel"))
          .map((part) => ({
            isAvailable: part.isAvailable,
            label: part.name,
            value: part.name
          }));
      }

      setFerti([...filteredFerti, ...ethrelPart]);
    }
  }, [parts, saving]);

  useEffect(() => {
    if (farmData && farmData.length > 0) {
      setFarm(farmData.find(f => f.id === farm.id))
    }
  }, [farmData])

  function plantPercent(part, total) {
    return Math.round((parseInt(part) / total) * 100)
  }

  const getMult = (numOne, numTwo) => {
    const num = numOne * numTwo
    return Math.round(num * 100) / 100
  }

  const handleBilang = (e) => {
    if (
      isNaN(e)
      || e > (parseInt(farm.remainingPlant) || parseInt(farm.plantNumber))
      || e <= 0
    ) {
      setBilangError(true)
    } else {
      setBilangError(false)
    }
    setBilang(e)
    setQntyPrice(getMult((e / 30000), comps.defQnty))
    setComps(prev => ({
      ...prev,
      qntyPrice: getMult((e / 30000), prev.defQnty)
    }))
  }

  const handleModalClose = () => {
    setFertilizer('')
    setComps({ qntyPrice: 0, foreignId: '' })
    setQntyPrice(0)
    setBilang(0)
    setIsAdd(false);
    setReport(false);
    setDate(new Date())
    setApplication([])
  };


  // Fetch activities from Firestore and prepend the default step
  useEffect(() => {
    const unsubscribe = onSnapshot(activityQuery, (snapshot) => {
      // Default step
      const defaultStep = {
        text: "Planting of pineapple",
        date: farm.start_date.toDate(),
      };

      if (!snapshot.empty) {
        const fetchedSteps = snapshot.docs.map((doc) => ({
          text: `${doc.data().qnty}${doc.data().type === 'a' ? '' : '%'}, ${doc.data().label}`,
          date: doc.data().createdAt.toDate(),
        }));

        // Prepend the default step
        setDynamicSteps([defaultStep, ...fetchedSteps]);
      } else {
        // Only display the default step if no activities exist
        setDynamicSteps([defaultStep]);
      }
    });

    return () => unsubscribe();
  }, []);

  function ethrelValid(currdate, start_date) {
    const monthEight = new Date(start_date.setMonth(start_date.getMonth() + 8))
    const monthTwelve = new Date(start_date.setMonth(start_date.getMonth() + 12))
    const bool = currdate >= monthEight && currdate <= monthTwelve
    return bool
  }

  const handleRepPer = (input) => {
    // Remove non-numeric characters
    let numericInput = input.replace(/[^0-9]/g, '');

    if (numericInput === '0') {
      Alert.alert('Invalid Input', 'Percentage cannot be 0.');
      setReportPer('');
      return;
    }

    if (!numericInput) {
      setReportPer('')
      return
    }

    const damage = 100 - (selectedBatch ? selectedBatch.damage || 0 : farm.damage || 0)

    numericInput = Math.min(numericInput, damage, 100);

    setReportPer(numericInput.toString());
  };


  function getPinePrice(pine, pineObject) {
    const newPine = pineObject.filter(thePine => thePine.name.toLowerCase() === pine.toLowerCase())[0]
    return newPine.price
  }

  useEffect(() => {
    async function calculateAndSaveData() {
      if (!actualComponents) return;
      const actualRoi = farm.roi.find(fr => fr.type === 'a')

      // LABOR MATERIAL
      const totalLabor = actualComponents
        .filter(item => item.particular.toLowerCase() === 'labor')
        .reduce((sum, item) => sum + item.totalPrice, 0);
      const totalMaterial = actualComponents
        .filter(item => item.particular.toLowerCase() === 'material' && item.parent.toLowerCase() !== 'fertilizer')
        .reduce((sum, item) => sum + item.totalPrice, 0);
      const totalFertilizer = actualComponents
        .filter(item => item.parent.toLowerCase() === "fertilizer")
        .reduce((sum, item) => sum + item.totalPrice, 0);

      // ROI
      const grossReturn = actualRoi.grossReturn * getPinePrice('good size', localPine) + actualRoi.butterBall * getPinePrice('butterball', localPine);
      const costTotal = totalMaterial + totalLabor + totalFertilizer;
      const netReturnValue = grossReturn - costTotal;
      const roiValue = (netReturnValue / grossReturn) * 100;

      const newRoi = farm.roi.map(fr => {
        if (fr.type === 'a') {
          return {
            ...fr,
            roi: roiValue,
            costTotal: costTotal,
            laborTotal: totalLabor,
            materialTotal: totalMaterial,
            fertilizerTotal: totalFertilizer,
            netReturn: netReturnValue
          }
        }
        return fr
      })
      await updateDoc(doc(farmColl, farm.id), {
        roi: newRoi
      })
    }

    // Call the async function
    calculateAndSaveData();

  }, [actualComponents]);

  const getPercentage = (pirsint, nambir) => {
    return Math.round((nambir / 100) * pirsint)
  }

  const getDifference = (pirsint, nambir) => {
    const amount = (pirsint / 100) * nambir
    return nambir - amount
  }

  const getRoi = (netReturn, grossReturn) => {
    const roi = (netReturn / grossReturn) * 100
    return roi
  }

  const getNewGross = (npk, plant) => {
    let newGoodSize = getPercentage(90, plant)
    let newButterBall = getPercentage(10, plant)

    const loam = 90;
    const sandy = 85;
    const clay = 80

    switch (npk) {
      case 'loam':
        newGoodSize = getPercentage(loam, plant)
        newButterBall = getPercentage(100 - loam, plant)
        break;
      case 'clay':
        newGoodSize = getPercentage(clay, plant)
        newButterBall = getPercentage(100 - clay, plant)
        break;
      case 'sandy':
        newGoodSize = getPercentage(sandy, plant)
        newButterBall = getPercentage(100 - sandy, plant)
        break;
      default:
        break;
    }

    return [newGoodSize, newButterBall]
  }

  const handleSave = async (act) => {
    setSaving(true);
    try {
      const currDate = date || new Date();
      if (act === "r") {
        const batch = writeBatch(db); // Initialize batch operation
        const date = new Date();
        const farmDocRef = doc(farmColl, farm.id);
        const farmRoi = farm.roi.find(r => r.type === 'a');

        let batchPer = reportPer;
        let selectedBatch;

        const plant = farm.remainingPlant || farm.plantNumber;
        let theDamage = ((reportPer / 100) * farm.plantNumber);
        let remainingPlant = plant - theDamage;

        if (farm.batches) {
          selectedBatch = farm.batches.find(b => b.index === batchValue)
          theDamage = ((reportPer / 100) * selectedBatch.plantNumber);
          const batchRemainingPlant = selectedBatch.plantSize - theDamage;
          remainingPlant = plant - theDamage;
          batchPer = (theDamage / farm.plantNumber) * 100;

          const updatedBatches = farm.batches.map(b =>
            b.index === batchValue ? {
              ...b,
              plantSize: batchRemainingPlant,
              damage: (selectedBatch.damage || 0) + parseInt(reportPer)
            } : b
          );

          batch.update(farmDocRef, { batches: updatedBatches });
        }

        let failed = false;

        if (mark || remainingPlant === 0) {
          failed = true;
          batch.update(farmDocRef, {
            crop: true,
            harvest_date: Timestamp.fromDate(date),
            remainingPlant: 0,
            remarks: 'failed',
          });
        }

        // Calculate new gross and ROI values
        const [newGoodSize, newButterBall] = getNewGross(farm.soil.toLowerCase(), remainingPlant);

        console.log("good size", newGoodSize)
        console.log("batterball", newButterBall)

        const grossReturn = (newGoodSize * getPinePrice('good size', localPine)) +
          (newButterBall * getPinePrice('butterball', localPine));
        const costTotal = farmRoi.materialTotal + farmRoi.laborTotal + farmRoi.fertilizerTotal;
        const netReturnValue = grossReturn - costTotal;
        const roiValue = (netReturnValue / grossReturn) * 100;

        const [ggDamage, bbDamage] = getNewGross(farm.soil.toLowerCase(), theDamage);

        const newRoi = farm.roi.map(fr => {
          if (fr.type === 'a') {
            return {
              ...fr,
              butterBall: newButterBall,
              costTotal: costTotal,
              grossReturn: newGoodSize,
              netReturn: netReturnValue,
              damageCost: (farm.damageCost || 0) +
                ((ggDamage * getPinePrice('good size', localPine)) +
                  (bbDamage * getPinePrice('butterball', localPine))),
              roi: roiValue,
            };
          }
          return fr;
        });

        batch.update(farmDocRef, {
          roi: newRoi,
          remainingPlant: failed ? 0 : farm.batches ? farm.remainingPlant : remainingPlant,
          damage: (farm.damage || 0) + parseInt(batchPer),
        });

        const activityRef = doc(activityColl);
        batch.set(activityRef, {
          type: act,
          createdAt: currDate,
          label: `${reportTitle} ${farm.batches ? `(Batch ${selectedBatch.index})` : ''}`,
          compId: '',
          desc: reportDesc,
          qnty: reportPer,
          remarks: failed,
          unit: 'pcs',
        });

        // Commit the batched operations
        await batch.commit();

        setReportPer('');
      } else {
        const theLabel = ferti.find(obj => obj.value === fertilizer);
        let newHarvest = null

        if (theLabel.label.toLowerCase() === "flower inducer (ethrel)" && events) {
          const batches = farm.batches || [];
          const vege_event = events.find(p => p.className === 'vegetative');

          if (!vege_event) {
            console.warn("No vegetative event found.");
            setSaving(false);
            handleModalClose();
            return;
          }

          const date_diff = currDate - vege_event.end_time.toDate();

          if (farm.plantNumber - farm.ethrel === 0) {
            setSaving(false);
            handleModalClose();
            return;
          }

          if (!ethrelValid(currDate, vege_event.start_time.toDate())) {
            setSaving(false);
            handleModalClose();
            return;
          }

          const eventStages = ["vegetative", "flowering", "fruiting", "harvesting"];

          const addAndSetDoc = async (eventData) => {
            const docRef = await addDoc(collection(db, `farms/${farm.id}/events`), eventData);
            await updateDoc(docRef, { id: docRef.id });
            return docRef;
          };

          let newHarvest;

          for (let stage of eventStages) {
            const e = events.find(event => event.className.toLowerCase() === stage);
            if (!e) continue;

            const batchIndex = batches.length + 1;

            switch (stage) {
              case "vegetative":
                e.end_time = Timestamp.fromDate(currDate);
                e.title = `Batch ${batchIndex} [${bilang}pcs (${plantPercent(bilang, farm.plantNumber)}%)] - ${e.title}`;
                await addAndSetDoc({
                  ...e,
                  className: e.className + "Actual",
                  createdAt: new Date(),
                  index: batchIndex,
                });
                break;

              case "flowering":
                e.start_time = Timestamp.fromDate(currDate);
                e.end_time = Timestamp.fromMillis(e.end_time.toMillis() + date_diff);
                await addAndSetDoc({
                  ...e,
                  className: e.className + "Actual",
                  createdAt: new Date(),
                  index: batchIndex,
                });
                break;

              case "fruiting":
                e.start_time = Timestamp.fromMillis(e.start_time.toMillis() + date_diff);
                const fruitingEndDate = new Date(e.start_time.toDate());
                fruitingEndDate.setMonth(fruitingEndDate.getMonth() + 3);
                fruitingEndDate.setDate(fruitingEndDate.getDate() + 15);
                e.end_time = Timestamp.fromDate(fruitingEndDate);

                await addAndSetDoc({
                  ...e,
                  className: e.className + "Actual",
                  createdAt: new Date(),
                  index: batchIndex,
                });

                newHarvest = e.end_time;
                batches.push({
                  index: batchIndex,
                  harvestDate: e.end_time,
                  plantSize: parseInt(bilang),
                  plantNumber: parseInt(bilang)
                });
                break;

              case "harvesting":
                const fruitingEvent = batches[batches.length - 1];
                if (!fruitingEvent || !fruitingEvent.harvestDate) {
                  console.warn("Skipping harvesting: Missing previous harvestDate.");
                  continue;
                }

                const harvestingStartDate = fruitingEvent.harvestDate.toDate();
                e.start_time = Timestamp.fromDate(harvestingStartDate);
                const harvestingDate = new Date(e.start_time.toDate());
                harvestingDate.setDate(harvestingDate.getDate() + 15);
                e.end_time = Timestamp.fromDate(harvestingDate);

                await addAndSetDoc({
                  ...e,
                  className: e.className + "Actual",
                  createdAt: new Date(),
                  index: batchIndex,
                });
                break;

              default:
                break;
            }
          }

          const plant = farm.remainingPlant || farm.plantNumber

          await updateDoc(doc(db, `farms/${farm.id}`), {
            isEthrel: currDate,
            ethrel: farm.ethrel + parseInt(bilang),
            remainingPlant: plant - parseInt(bilang),
            batches,
          });

          await addDoc(activityColl, {
            type: act,
            createdAt: currDate,
            label: theLabel.label,
            compId: fertilizer,
            qnty: qntyPrice,
            desc: `Ikaw ay naglagay ng ${qntyPrice} liter ng ${theLabel.label}`,
            unit: 'liter',
          });

          const pComp = parts.find(c => c.name === theLabel.label);
          const newQnty = getMult(farm.area, pComp.defQnty);

          const actComp = {
            ...pComp,
            qntyPrice: newQnty,
            totalPrice: getMult(newQnty, pComp.price),
            foreignId: pComp.id,
            type: "a",
          };

          setActualComponents([...components.filter(comp => comp.type !== 'p'), actComp]);
          const newCompAct = await addDoc(componentsColl, actComp);
          await updateDoc(newCompAct, { id: newCompAct.id });

          if (events.length > 3 && newHarvest > new Date(farm.harvest_date.toDate())) {
            await updateDoc(doc(db, `farms/${farm.id}`), {
              harvest_date: newHarvest,
            });
          } else if (events.length <= 3) {
            await updateDoc(doc(db, `farms/${farm.id}`), {
              harvest_date: newHarvest,
            });
          }

          setSaving(false);
          handleModalClose();
        }
        else {

          const pComp = parts.find(p => p.name === theLabel.label)
          const newQnty = getMult(farm.area, pComp.defQnty)
          const actComp = {
            ...pComp,
            qntyPrice: qntyPrice,
            totalPrice: getMult(qntyPrice, pComp.price),
            foreignId: pComp.id,
            type: "a"
          }

          await addDoc(activityColl,
            {
              type: act,
              createdAt: currDate,
              label: theLabel.label,
              compId: fertilizer,
              qnty: qntyPrice,
              desc: `Ikaw ay naglagay ng ${qntyPrice} ${pComp.unit} ng ${theLabel.label}`,
              unit: pComp.unit,
            }
          );

          setActualComponents([...components.filter(comp => comp.type !== 'p'), actComp]);
          const newCompAct = await addDoc(componentsColl, actComp)
          await updateDoc(newCompAct, { id: newCompAct.id })
        }
      }
      setSaving(false);
      handleModalClose();
    } catch (error) {
      console.error('error updating document', error);
      setSaving(false);
    }
  };

  function getOrdinal(number) {
    const suffixes = ["th", "st", "nd", "rd"];
    const value = number % 100;
    return number + (suffixes[(value - 20) % 10] || suffixes[value] || suffixes[0]);
  }

  const customStyles = {
    stepIndicatorSize: 10,
    currentStepIndicatorSize: 40,
    separatorStrokeWidth: 1,
    currentStepStrokeWidth: 3,
    stepStrokeCurrentColor: '#fe7013',
    stepStrokeWidth: 3,
    stepStrokeFinishedColor: '#fe7013',
    stepStrokeUnFinishedColor: '#aaaaaa',
    separatorFinishedColor: '#fe7013',
    separatorUnFinishedColor: '#aaaaaa',
    stepIndicatorFinishedColor: '#fe7013',
    stepIndicatorUnFinishedColor: '#ffffff',
    stepIndicatorCurrentColor: '#ffffff',
    stepIndicatorLabelFontSize: 13,
    currentStepIndicatorLabelFontSize: 13,
    stepIndicatorLabelCurrentColor: '#fe7013',
    stepIndicatorLabelFinishedColor: '#ffffff',
    stepIndicatorLabelUnFinishedColor: '#aaaaaa',
    labelColor: '#999999',
    labelSize: 13,
    currentStepLabelColor: '#fe7013',
    labelAlign: 'flex-start'
  };
  const renderStepIndicator = ({ position, stepStatus }) => {
    if (position === 0 && stepStatus === 'finished') {
      return <Image source={require('../assets/pineapple.png')} width={10} />;
    }

    return (
      <View
        style={{
          width: 20,
          height: 20,
          borderRadius: 10,
          //backgroundColor: stepStatus === 'current' ? '#fe7013' : '#aaaaaa',
        }}
      />
    );
  };

  const [mark, setMark] = useState(false)

  useEffect(() => {
    if (!handleMark()) {
      setMark(false);
    }
  }, [reportPer]);

  const handleMark = () => {
    return reportPer >= 70 && reportPer <= 100;
  };

  const handleConfirmation = () => {
    if (!reportTitle || !reportDesc || reportPer === '0' || reportPer === '') {
      Alert.alert(
        'Input Needed',
        'Please fill out missing fields before submitting.'
      );
      return;
    }

    if (mark) {
      Alert.alert(
        'Mark as Complete',
        'This will remove the Farm from the list of active Farms.',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'Ok',
            onPress: () => {
              handleSave("r");
              return;
            },
          },
        ]
      );
    } else {
      Alert.alert('Report', 'Are you sure you want to submit this report?',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'Yes',
            onPress: () => handleSave("r")
          },
        ]
      )
    }

  }
  const renderItem = (item) => (
    <View
      style={{
        padding: 17,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Text
        style={{
          flex: 1,
          fontSize: 16,
        }}
      >
        {item.label}
      </Text>
      {reportTitle.includes(item.value) && (
        <EvilIcons
          style={{ margin: 5 }}
          color="black"
          name="check"
          size={20}
        />
      )}
    </View>
  );
  return (
    <View style={styles.container}>
      <View style={{ display: 'flex', gap: 2, flexDirection: 'row', justifyContent: 'space-between', }}>
        <TouchableOpacity disabled={farm.crop} onPress={() => setIsAdd(true)} style={{ ...styles.addButton, flex: 1 }}>
          <Text style={styles.addButtonText}>Maglagay ng Aktibidades</Text>
        </TouchableOpacity>
        <TouchableOpacity disabled={farm.crop} onPress={() => setReport(true)} style={{ ...styles.addButton, backgroundColor: 'red', flex: 1 }}>
          <Text style={styles.addButtonText}>Add-report</Text>
        </TouchableOpacity>
      </View>
      {dynamicSteps.length > 0 ? (
        <View style={styles.stepContainer}>
          <View style={{ flex: 1 }}>
            <StepIndicator
              customStyles={customStyles}
              currentPosition={currentStep}
              stepCount={dynamicSteps.length}
              labels={dynamicSteps.map(step => step.text)}
              direction="vertical"
              renderStepIndicator={renderStepIndicator}
            />
          </View>
          <View style={styles.dateColumn}>
            {dynamicSteps.map((step, index) => (
              <Text key={index} style={styles.dateText}>
                {moment(step.date).format('MMM DD, YYYY')}
              </Text>
            ))}
          </View>
        </View>
      ) : (
        <Text style={styles.noActivitiesText}>Wala pang aktibidades</Text>
      )}

      {/* Modal for adding activity */}
      <Modal
        visible={isAdd}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsAdd(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Maglagay ng Aktibidades</Text>
            <Text>Kasalukuyang Bilang ng Buwan: {currentMonthDiff}</Text>
            <View style={{ display: 'flex', flexDirection: 'row' }}>
              <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 15, marginBottom: 5 }}>Abono:</Text>
              <Text style={{ color: 'red', fontWeight: 'bold', fontSize: 15, marginBottom: 5 }}>*</Text>
            </View>
            {ferti &&
              <Dropdown
                data={ferti}
                labelField="label"
                valueField="value"
                placeholder="Pumili ng Abono"
                value={fertilizer}
                style={styles.input}
                // itemContainerStyle={item => {
                //   backgroundColor: item.
                // }}
                onChange={item => {
                  const monthApply = [1, 4, 7, 10];
                  const obj = parts?.find(obj => obj.name === item.value)
                  const apply = components?.filter(c => c.foreignId === obj.id && c.parent.toLowerCase() === 'fertilizer')
                  const currentApp = Math.max(...monthApply.filter(num => num <= currentMonthDiff));
                  const selectedComp = components.find(c => c.foreignId === obj.id && c.label === currentApp)

                  const newArray = monthApply.map((month) => {
                    const match = apply
                      .find((a) => a.label === month);

                    if (match) {
                      return {
                        qntyPrice: match.qntyPrice,
                        unit: match.unit,
                        label: match.label
                      };
                    } else {
                      return {
                        qntyPrice: 0,
                        unit: obj?.unit,
                        label: month
                      };
                    }
                  });

                  setFertilizer(item.value)
                  setComps(obj)
                  setApplication(obj.parent.toLowerCase() === 'fertilizer' ? newArray.sort((a, b) => a.label - b.label) : [])
                  setQntyPrice(selectedComp ? selectedComp.qntyPrice : 0)
                  setBilang((parseInt(farm.remainingPlant || 0)).toString())
                }}
              />
            }
            {
              fertilizer.toLocaleLowerCase() === "flower inducer (ethrel)" &&
              <View style={styles.quantyContainer}>
                <View style={{ display: 'flex', flexDirection: 'row' }}>
                  <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 15, marginBottom: 5 }}>Bilang ng Tanim:</Text>
                  <Text style={{ color: 'red', fontWeight: 'bold', fontSize: 15, marginBottom: 5 }}>*</Text>
                </View>
                <TextInput
                  placeholder="Bilang ng tanim"
                  keyboardType="numeric"
                  style={{ ...styles.input, borderColor: bilangError ? 'red' : '#ccc' }}
                  value={bilang}
                  onChangeText={handleBilang}
                />
              </View>
            }
            <View style={{ display: 'flex', flexDirection: 'row' }}>
              <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 15, marginBottom: 5 }}>Bilang:</Text>
              <Text style={{ color: 'red', fontWeight: 'bold', fontSize: 15, marginBottom: 5 }}>*</Text>
            </View>
            <View style={styles.quantyContainer}>
              <TextInput
                placeholder="0.0"
                keyboardType="decimal-pad"
                style={{ ...styles.input, marginBottom: 0 }}
                value={qntyPrice.toString()}
                onChangeText={(value) => {
                  if (value.startsWith(".")) {
                    value = "0" + value;
                  }
                  if (/^\d*\.?\d*$/.test(value)) {
                    setQntyPrice(value);
                  }
                  setComps(prev => ({
                    ...prev,
                    qntyPrice: parseFloat(value)
                  }));
                }
                }
              />

              <View style={styles.suffixContainer}>
                <Text style={styles.suffix}>{comps.unit || ""}</Text>
              </View>
            </View>
            <View style={{ marginBottom: 20 }}>
              {
                application.length > 0
                && application.map(app => {
                  return (
                    <Text style={styles.subScript}>
                      *Apply {app.qntyPrice.toFixed(2)} {app.unit} on {getOrdinal(app.label)} month
                    </Text>
                  )
                })
              }
            </View>
            <View>
              <View style={{ display: 'flex', flexDirection: 'row' }}>
                <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 15, marginBottom: 5 }}>Petsa:</Text>
                <Text style={{ color: 'red', fontWeight: 'bold', fontSize: 15, marginBottom: 5 }}>*</Text>
              </View>
              <View style={{ ...styles.quantyContainer, display: 'flex', flexDirection: 'row', marginBottom: 10, }}>
                <TextInput
                  value={date ? date.toLocaleDateString() : ''}
                  editable={false}
                  style={{ ...styles.input, width: '80%', borderBottomRightRadius: 0, borderTopRightRadius: 0 }}
                />
                <TouchableOpacity onPress={() => setStartPicker(true)}
                  style={{ ...styles.input, width: '20%', borderBottomLeftRadius: 0, borderTopLeftRadius: 0, paddingHorizontal: 22, paddingVertical: 0, justifyContent: 'center' }}
                >
                  <Image source={require('../assets/calender.png')} />
                </TouchableOpacity>

                <DateTimePickerModal
                  isVisible={startPicker}
                  mode="date"
                  maximumDate={new Date()}
                  onConfirm={(date) => {
                    setDate(date);
                    setStartPicker(false);
                  }}
                  onCancel={() => setStartPicker(false)}
                  style={{ marginBottom: 10 }}
                />

              </View>
              <View style={{ display: 'flex', flexDirection: 'row', alignContent: 'center', gap: 2, width: '100%' }}>
                <TouchableOpacity onPress={handleModalClose} style={styles.cancelButton}>
                  <Text style={styles.cancelButtonText}>Kanselahin</Text>
                </TouchableOpacity>
                {
                  components && roi &&
                  <TouchableOpacity
                    onPress={() => handleSave("a")}
                    style={[styles.saveButton, (saving || bilangError || !comps.id) && { backgroundColor: 'gray' }]}
                    disabled={saving || bilangError || !comps.id}
                  >
                    <Text style={styles.saveButtonText}>{saving ? 'Isinusumite...' : 'Isumite'}</Text>
                  </TouchableOpacity>
                }
              </View>
            </View>
          </View>
        </View>
      </Modal>
      {/* Modal for adding Report */}
      <Modal
        visible={report}
        transparent={true}
        animationType='slide'
        onRequestClose={() => setReport(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Mag-report</Text>
            <View style={styles.quantyContainer}>
              <View style={{ display: 'flex', flexDirection: 'row' }}>
                <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 15, marginBottom: 5 }}>Uri ng report:</Text>
                <Text style={{ color: 'red', fontWeight: 'bold', fontSize: 15, marginBottom: 5 }}>*</Text>
              </View>
              <MultiSelect
                style={{
                  height: 50,
                  backgroundColor: 'transparent',
                  borderBottomColor: 'gray',
                  borderBottomWidth: 0.5,
                }}
                placeholderStyle={{ fontSize: 16, }}
                selectedTextStyle={{ fontSize: 14, }}
                inputSearchStyle={{
                  height: 40,
                  fontSize: 16,
                }}
                iconStyle={{
                  width: 20,
                  height: 20,
                }}
                search
                data={title}
                labelField="label"
                valueField="value"
                placeholder="Pumili"
                searchPlaceholder="Maghanap..."
                value={reportTitle}
                onChange={item => {
                  setReportTitle(item);
                }}
                renderLeftIcon={() => (
                  <AntDesign
                    style={{ marginRight: 5, }}
                    color="black"
                    name="Safety"
                    size={20}
                  />
                )}
                selectedStyle={{ borderRadius: 12, }}
                renderItem={renderItem}
              />
              {/* <TextInput
                // label='Title'
                // placeholder='Title'
                onChangeText={(e) => setReportTitle(e)}
                style={{ ...styles.input, borderColor: bilangError ? 'red' : '#ccc' }}
              /> */}
              <View style={{ display: 'flex', flexDirection: 'row' }}>
                <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 15, marginBottom: 5 }}>Deskripsyon:</Text>
                <Text style={{ color: 'red', fontWeight: 'bold', fontSize: 15, marginBottom: 5 }}>*</Text>
              </View>
              <TextInput
                editable
                multiline
                numberOfLines={4}
                // maxLength={60}
                // placeholder='Description'
                onChangeText={(e) => setReportDesc(e)}
                style={{ ...styles.input, borderColor: bilangError ? 'red' : '#ccc' }}
              />
              {dd_batches.length > 0 &&
                < View style={styles.quantyContainer}>
                  <View style={{ display: 'flex', flexDirection: 'row' }}>
                    <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 15, marginBottom: 5 }}>Batch:</Text>
                    <Text style={{ color: 'red', fontWeight: 'bold', fontSize: 15, marginBottom: 5 }}>*</Text>
                  </View>
                  <Dropdown
                    data={dd_batches}
                    labelField="label"
                    valueField="value"
                    placeholder="Select Batch"
                    value={batchValue}
                    style={styles.input}
                    onChange={item => {
                      if (farm.batches) {
                        const sdd_batch = dd_batches.find(b => b.index === item.value)
                        console.log('marilag', sdd_batch);
                        setSelectedBatch(sdd_batch)
                      }

                      setBatchValue(item.value)
                    }}
                  />
                </View>

              }
              <View style={{ display: 'flex', flexDirection: 'row' }}>
                <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 15, marginBottom: 5 }}>Porsyento ng Pinsala:</Text>
                <Text style={{ color: 'red', fontWeight: 'bold', fontSize: 15, marginBottom: 5 }}>*</Text>
              </View>
              <View style={styles.quantyContainer}>
                <TextInput
                  placeholder={(100 - (selectedBatch ? selectedBatch.damage || 0 : farm.damage || 0)).toString() + '% remaining plants'}
                  keyboardType="numeric"
                  style={styles.input}
                  value={reportPer}
                  onChangeText={handleRepPer}
                />
                <View style={styles.suffixContainer}>
                  <Text style={styles.suffix}>%</Text>
                </View>
              </View>
              <View style={{ display: 'flex', flexDirection: 'row' }}>
                <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 15, marginBottom: 5 }}>Petsa:</Text>
                <Text style={{ color: 'red', fontWeight: 'bold', fontSize: 15, marginBottom: 5 }}>*</Text>
              </View>
              <View style={{ ...styles.quantyContainer, display: 'flex', flexDirection: 'row', marginBottom: 10, }}>
                <TextInput
                  value={date ? date.toLocaleDateString() : `${new Intl.DateTimeFormat('en-US', {
                    month: 'short',
                    day: '2-digit',
                    year: 'numeric'
                  }).format(new Date())}`}
                  editable={false}
                  style={{ ...styles.input, width: '80%', borderBottomRightRadius: 0, borderTopRightRadius: 0 }}
                />
                <TouchableOpacity onPress={() => setStartPicker(true)}
                  style={{ ...styles.input, width: '20%', borderBottomLeftRadius: 0, borderTopLeftRadius: 0, paddingHorizontal: 10, paddingVertical: 0, justifyContent: 'center' }}
                >
                  <Entypo name="calendar" size={24} color="black" />
                </TouchableOpacity>

                <DateTimePickerModal
                  isVisible={startPicker}
                  mode="date"
                  maximumDate={new Date()}
                  onConfirm={(date) => {
                    setDate(date);
                    setStartPicker(false);
                  }}
                  onCancel={() => setStartPicker(false)}
                  style={{ marginBottom: 10 }}
                />

              </View>

            </View>

            <View style={{ display: 'flex', flexDirection: 'row', alignContent: 'center', gap: 2, width: '100%' }}>
              <TouchableOpacity onPress={handleModalClose} style={styles.cancelButton2}>
                <Text style={styles.cancelButtonText}>Kanselahin</Text>
              </TouchableOpacity>
              {
                components && roi &&
                <TouchableOpacity
                  onPress={handleConfirmation}
                  style={[styles.ReportButton, saving && { backgroundColor: 'gray' }]}
                  disabled={saving}
                >
                  <Text style={styles.saveButtonText}>{saving ? 'Isinusumite...' : 'Report'}</Text>
                </TouchableOpacity>
              }
            </View>

            <View style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 20,
            }}>
              <View style={{
                display: 'flex',
                flexDirection: 'row',
                marginBottom: 10,
              }}>
                <CheckBox
                  disabled={!handleMark()}
                  value={mark}
                  onValueChange={setMark}
                  color={mark ? '#f6a30b' : undefined}
                  style={{ margin: 8 }}
                />
                <TouchableOpacity onPress={() => setMark(!mark)} disabled={!handleMark()}>
                  <Text style={{ fontSize: 15, color: 'black', marginTop: 10, fontFamily: 'serif' }}>Mark as Complete Farm?</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

      </Modal >
    </View >
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  stepContainer: {
    flexDirection: 'row',
  },
  addButton: {
    backgroundColor: 'green',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
    padding: 5
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  dateColumn: {
    justifyContent: 'flex-start',
    marginLeft: 10,
  },
  dateText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 20,
  },
  noActivitiesText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  subScript: {
    fontSize: 12,
    fontWeight: '100',
    fontStyle: 'italic',
    marginLeft: 2
  },
  saveButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  ReportButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
  },
  cancelButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  cancelButton2: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
  },
  quantyContainer: {
    position: 'relative',
    width: '100%',
  },
  suffixContainer: {
    position: 'absolute',
    right: 10,
    top: 15,
  },
  suffix: {
    fontSize: 16,
  },
  button: {
    // backgroundColor: '#4DAF50',
    alignItems: 'center',
    // padding: 12,
    borderRadius: 5,
  },
  textInputFocus: {
    flex: 1,
    height: 46,
    opacity: 1.0,
    borderColor: '#ccc',
    borderWidth: 1.6,
    borderRadius: 5,
    paddingHorizontal: 18,
    // color: '#3C3C3B',
    fontSize: 16,

  },
  cmplt:
  {
    display: 'flex',
    color: '#fff',
    // fontFamily: 'lucida grande',
    borderRadius: 30,
    width: '100%',
    fontSize: 20,
    textAlign: 'center',
    paddingHorizontal: 10
  },
});

export default Activities;
