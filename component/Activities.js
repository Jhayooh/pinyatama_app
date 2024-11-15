import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Alert, Image } from 'react-native';
import StepIndicator from 'react-native-step-indicator';
import { Dropdown } from 'react-native-element-dropdown';
import moment from 'moment';
import { addDoc, collection, query, orderBy, onSnapshot, Timestamp, updateDoc, doc, arrayUnion } from 'firebase/firestore'; // added onSnapshot
import { db } from '../firebase/Config';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { LinearGradient } from 'expo-linear-gradient';
import CheckBox from 'expo-checkbox'

const ferti = [
  { label: "Ammophos (16-20-0)", value: "Ammophos (16-20-0)" },
  { label: "Muriate of Potash (0-0-60)", value: "Muriate of Potash (0-0-60)" },
  { label: "Urea (Granular) (46-0-0)", value: "Urea (Granular) (46-0-0)" },
  { label: "Ammosul (21-0-0)", value: "Ammosul (21-0-0)" },
  { label: "Complete (14-14-14)", value: "Complete (14-14-14)" },
  { label: "Water Soluble Calcium Nitrate (17-0-17)", value: "Water Soluble Calcium Nitrate (17-0-17)" },
  { label: "Flower Inducer (ethrel)", value: "Flower Inducer (ethrel)" },
];


const Activities = ({ route }) => {
  const [farm, setFarm] = useState(route.params.farm)

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
  const [reportPer, setReportPer] = useState(0)

  const [bilangError, setBilangError] = useState(false)

  const [startPicker, setStartPicker] = useState(false);
  const [date, setDate] = useState(null)

  const [alert, setAlert] = useState({ visible: false, message: '', severity: '' });

  useEffect(() => {
    if (!e) return
    setEvents(e)
  }, [e])

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
    if (isNaN(e) || e > (parseInt(farm.plantNumber) - parseInt(farm.ethrel)) || e <= 0) {
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
          text: `${doc.data().qnty}${doc.data().type === 'a' ? 'kg' : '%'}, ${doc.data().label}`,
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

    const damage = 100-farm.damage

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

        const date = new Date()
        const farmDocRef = doc(farmColl, `${farm.id}`)
        const farmRoi = farm.roi.find(r => r.type === 'a')
        const plant = farm.remainingPlant || farm.plantNumber;
        const theDamage = ((reportPer / 100) * farm.plantNumber)
        const remainingPlant = plant - theDamage;

        if (mark || remainingPlant === 0) {
          await updateDoc(farmDocRef, {
            crop: true,
            cropStage: 'complete',
            harvest_date: Timestamp.fromDate(date),
            remainingPlant: 0
          });
        }

        const [newGoodSize, newButterBall] = getNewGross(farm.soil.toLowerCase(), remainingPlant)

        const grossReturn = (newGoodSize * getPinePrice('good size', localPine)) + (newButterBall * getPinePrice('butterball', localPine));
        const costTotal = farmRoi.materialTotal + farmRoi.laborTotal + farmRoi.fertilizerTotal;
        const netReturnValue = grossReturn - costTotal;
        const roiValue = (netReturnValue / grossReturn) * 100;

        const [ggDamage, bbDamage] = getNewGross(farm.soil.toLowerCase(), theDamage)

        const newRoi = farm.roi.map(fr => {
          if (fr.type === 'a') {
            return {
              ...fr,
              butterBall: newButterBall,
              costTotal: costTotal,
              grossReturn: newGoodSize,
              netReturn: netReturnValue,
              damageCost: farm.damageCost || 0 + ((ggDamage * getPinePrice('good size', localPine)) + (bbDamage * getPinePrice('butterball', localPine))),
              roi: roiValue,
            }
          }
          return fr
        })


        await updateDoc(farmDocRef, {
          roi: newRoi,
          remainingPlant: remainingPlant,
          damage: (farm.damage || 0) + parseInt(reportPer)
        })

        await addDoc(activityColl,
          {
            type: act,
            createdAt: currDate,
            label: reportTitle,
            compId: '',
            desc: reportDesc,
            qnty: reportPer,
          }
        )
      } else {
        const theLabel = ferti.find(obj => obj.value === fertilizer);
        let newHarvest = null
        if (theLabel.label.toLowerCase() === "flower inducer (ethrel)" && events) {
          const vege_event = events.find(p => p.className === 'vegetative');
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
          for (const e of events) {
            switch (e.className.toLowerCase()) {
              case 'vegetative':
                e.end_time = Timestamp.fromDate(currDate);
                e.title = `${e.title} - ${farm.plantNumber} (${plantPercent(farm.plantNumber, farm.plantNumber)}%)`;
                const vegeEvent = await addDoc(collection(db, `farms/${farm.id}/events`), {
                  ...e,
                  className: e.className + 'Actual',
                  createdAt: currDate,
                });
                await updateDoc(vegeEvent, { id: vegeEvent.id });
                break;
              case 'flowering':
                e.start_time = Timestamp.fromDate(currDate);
                e.end_time = Timestamp.fromMillis(e.end_time.toMillis() + date_diff);
                const flowEvent = await addDoc(collection(db, `farms/${farm.id}/events`), {
                  ...e,
                  className: e.className + 'Actual',
                  createdAt: currDate,
                });
                await updateDoc(flowEvent, { id: flowEvent.id });
                break;
              case 'fruiting':
                e.start_time = Timestamp.fromMillis(e.start_time.toMillis() + date_diff);
                const et = new Date(e.start_time.toDate());
                et.setMonth(et.getMonth() + 3);
                et.setDate(et.getDate() + 15);
                e.end_time = Timestamp.fromDate(et);
                const fruEvent = await addDoc(collection(db, `farms/${farm.id}/events`), {
                  ...e,
                  className: e.className + 'Actual',
                  createdAt: currDate,
                });
                await updateDoc(fruEvent, { id: fruEvent.id });
                newHarvest = e.end_time
                break;
              default:
                break;
            }
          }
          await updateDoc(doc(db, `farms/${farm.id}`), {
            isEthrel: currDate,
            ethrel: farm.ethrel + parseInt(bilang),
          });
          await addDoc(activityColl,
            {
              type: act,
              createdAt: currDate,
              label: theLabel.label,
              compId: fertilizer,
              qnty: qntyPrice,
              desc: ''
            }
          );

          const pComp = parts.find(c => c.name === theLabel.label)
          const newQnty = getMult(farm.area, pComp.defQnty)
          const actComp = {
            ...pComp,
            qntyPrice: newQnty,
            totalPrice: getMult(newQnty, pComp.price),
            foreignId: pComp.id,
            type: "a"
          }
          setActualComponents([...components.filter(comp => comp.type !== 'p'), actComp]);
          const newCompAct = await addDoc(componentsColl, actComp)
          await updateDoc(newCompAct, { id: newCompAct.id })

          if (e.length > 3 && newHarvest > new Date(farm.harvest_date.toDate())) {
            await updateDoc(doc(db, `farms/${farm.id}`), {
              harvest_date: newHarvest,
            });
          } else if (e.length <= 3) {
            await updateDoc(doc(db, `farms/${farm.id}`), {
              harvest_date: newHarvest,
            });
          }

          setSaving(false);
          handleModalClose();
        } else {
          await addDoc(activityColl,
            {
              type: act,
              createdAt: currDate,
              label: theLabel.label,
              compId: fertilizer,
              qnty: qntyPrice,
              desc: ''
            }
          );

          const pComp = parts.find(p => p.name === theLabel.label)
          const newQnty = getMult(farm.area, pComp.defQnty)
          const actComp = {
            ...pComp,
            qntyPrice: qntyPrice,
            totalPrice: getMult(qntyPrice, pComp.price),
            foreignId: pComp.id,
            type: "a"
          }

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

  return (
    <View style={styles.container}>
      <View style={{ display: 'flex', gap: 2, flexDirection: 'row', justifyContent: 'space-between', }}>
        <TouchableOpacity disabled={farm.crop} onPress={() => setIsAdd(true)} style={{ ...styles.addButton, flex: 1 }}>
          <Text style={styles.addButtonText}>Add Activities</Text>
        </TouchableOpacity>
        <TouchableOpacity disabled={farm.crop} onPress={() => setReport(true)} style={{ ...styles.addButton, backgroundColor: 'red', flex: 1 }}>
          <Text style={styles.addButtonText}>Add Report</Text>
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
        <Text style={styles.noActivitiesText}>No activities yet</Text>
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
            <Text style={styles.modalTitle}>Add Activity</Text>
            <View style={{ display: 'flex', flexDirection: 'row' }}>
              <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 15, marginBottom: 5 }}>Fertilizer:</Text>
              <Text style={{ color: 'red', fontWeight: 'bold', fontSize: 15, marginBottom: 5 }}>*</Text>
            </View>
            <Dropdown
              data={ferti}
              labelField="label"
              valueField="value"
              placeholder="Select Fertilizer"
              value={fertilizer}
              style={styles.input}
              onChange={item => {
                const obj = parts?.find(obj => obj.name === item.value)
                setFertilizer(item.value)
                setComps(obj)
                setQntyPrice(getMult(farm.area, obj.defQnty))
                setBilang((parseInt(farm.plantNumber) - parseInt(farm.ethrel)).toString())
              }}
            />
            {
              fertilizer.toLocaleLowerCase() === "flower inducer (ethrel)" &&
              <View style={styles.quantyContainer}>
                <View style={{ display: 'flex', flexDirection: 'row' }}>
                  <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 15, marginBottom: 5 }}>Number of Plants:</Text>
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
              <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 15, marginBottom: 5 }}>Quantity:</Text>
              <Text style={{ color: 'red', fontWeight: 'bold', fontSize: 15, marginBottom: 5 }}>*</Text>
            </View>
            <View style={styles.quantyContainer}>
              <TextInput
                placeholder="0.0"
                keyboardType="numeric"
                style={styles.input}
                value={qntyPrice.toString()}
                onChangeText={(e) => {
                  const parsedValue = parseFloat(e) || 0;
                  setQntyPrice(parsedValue)
                  setComps(prev => ({
                    ...prev,
                    qntyPrice: parsedValue
                  }));
                }
                }
              />

              <View style={styles.suffixContainer}>
                <Text style={styles.suffix}>kg</Text>
              </View>
            </View>
            <View>
              <View style={{ display: 'flex', flexDirection: 'row' }}>
                <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 15, marginBottom: 5 }}>Date:</Text>
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
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                {
                  components && roi &&
                  <TouchableOpacity
                    onPress={() => handleSave("a")}
                    style={[styles.saveButton, saving || bilangError && { backgroundColor: 'gray' }]}
                    disabled={saving || bilangError}
                  >
                    <Text style={styles.saveButtonText}>{saving ? 'Saving...' : 'Save'}</Text>
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
            <Text style={styles.modalTitle}>REPORT</Text>
            <View style={styles.quantyContainer}>
              <View style={{ display: 'flex', flexDirection: 'row' }}>
                <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 15, marginBottom: 5 }}>Title:</Text>
                <Text style={{ color: 'red', fontWeight: 'bold', fontSize: 15, marginBottom: 5 }}>*</Text>
              </View>
              <TextInput
                // label='Title'
                // placeholder='Title'
                onChangeText={(e) => setReportTitle(e)}
                style={{ ...styles.input, borderColor: bilangError ? 'red' : '#ccc' }}
              />
              <View style={{ display: 'flex', flexDirection: 'row' }}>
                <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 15, marginBottom: 5 }}>Description:</Text>
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
              <View style={{ display: 'flex', flexDirection: 'row' }}>
                <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 15, marginBottom: 5 }}>Percentage of Damage:</Text>
                <Text style={{ color: 'red', fontWeight: 'bold', fontSize: 15, marginBottom: 5 }}>*</Text>
              </View>
              <View style={styles.quantyContainer}>
                <TextInput
                  placeholder={(100 - farm.damage).toString() + '% remaining plant'}
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
                <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 15, marginBottom: 5 }}>Date of Report:</Text>
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
                  <Image source={require('../assets/calender.png')} style={{}} />
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
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              {
                components && roi &&
                <TouchableOpacity
                  onPress={handleConfirmation}
                  style={[styles.ReportButton, saving && { backgroundColor: 'gray' }]}
                  disabled={saving}
                >
                  <Text style={styles.saveButtonText}>{saving ? 'Saving...' : 'Report'}</Text>
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

      </Modal>
    </View>
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
