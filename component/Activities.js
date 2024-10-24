import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import StepIndicator from 'react-native-step-indicator';
import { Dropdown } from 'react-native-element-dropdown';
import moment from 'moment';
import { addDoc, collection, query, orderBy, onSnapshot, Timestamp, updateDoc, doc } from 'firebase/firestore'; // added onSnapshot
import { db } from '../firebase/Config';
import { useCollectionData } from 'react-firebase-hooks/firestore';

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

  const [laborMaterial, setLaborMaterial] = useState(null)
  const [actualComponents, setActualComponents] = useState(null)

  const [comps, setComps] = useState({ qntyPrice: 0, foreignId: '' })

  const [reportTitle, setReportTitle] = useState('')
  const [reportDesc, setReportDesc] = useState('')
  const [reportPer, setReportPer] = useState(0)

  const [bilangError, setBilangError] = useState(false)

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

  const handleChange = (text) => {
    // Allow numbers and at most one decimal point
    const decimalRegex = /^[0-9]*\.?[0-9]*$/;

    // Validate input and update value if it matches the decimal format
    if (decimalRegex.test(text)) {
      setQuantity(parseFloat(text));
    }
  };

  const handleBilang = (e) => {
    if (isNaN(e) || e > (parseInt(farm.plantNumber) - parseInt(farm.ethrel)) || e <= 0) {
      setBilangError(true)
    } else {
      setBilangError(false)
    }
    setBilang(e)
    setComps(prev => ({
      ...prev,
      qntyPrice: getMult((e / 30000), prev.defQnty)
    }))
  }

  const handleModalClose = () => {
    setFertilizer('')
    setComps({ qntyPrice: 0, foreignId: '' })
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
    // Only allow numbers and limit the value to 100
    const numericInput = input.replace(/[^0-9]/g, ''); // Remove non-numeric characters
    if (numericInput <= 100) {
      setReportPer(numericInput);
    }
  };

  function getPinePrice(pine, pineObject) {
    const newPine = pineObject.filter(thePine => thePine.name.toLowerCase() === pine.toLowerCase())[0]
    return newPine.price
  }

  useEffect(() => {
    async function calculateAndSaveData() {
      if (!actualComponents) return;

      console.log("actualComponent", actualComponents);
      const actualRoi = roi.find(r => r.type === 'a');

      // LABOR MATERIAL
      const totalLabor = actualComponents
        .filter(item => item.particular.toLowerCase() === 'labor')
        .reduce((sum, item) => sum + item.totalPrice, 0);
      const totalMaterial = actualComponents
        .filter(item => item.particular.toLowerCase() === 'material')
        .reduce((sum, item) => sum + item.totalPrice, 0);
      const totalFertilizer = actualComponents
        .filter(item => item.parent.toLowerCase() === "fertilizer")
        .reduce((sum, item) => sum + item.totalPrice, 0);

      console.log("arjay macalinao", totalFertilizer);

      // ROI
      const grossReturn = actualRoi.grossReturn * getPinePrice('good size', localPine) + actualRoi.butterBall * getPinePrice('butterball', localPine);
      const costTotal = (totalMaterial - totalFertilizer) + totalLabor + totalFertilizer;
      const netReturnValue = grossReturn - costTotal;
      const roiValue = (netReturnValue / grossReturn) * 100;

      const eventId = roi?.find(event => event.type === 'a')?.id || null;
      if (eventId) {
        await updateDoc(doc(db, `farms/${farm.id}/roi/${actualRoi.id}`), {
          ...actualRoi,
          roi: roiValue,
          costTotal: costTotal,
          laborTotal: totalLabor,
          materialTotal: totalMaterial,
          fertilizerTotal: totalFertilizer,
          netReturn: netReturnValue
        });
      }
    }

    // Call the async function
    calculateAndSaveData();

  }, [actualComponents]);



  const handleSave = async (act) => {
    setSaving(true);
    try {
      const currDate = new Date();
      if (act === "r") {
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
        const qnty = comps.qntyPrice;
        if (theLabel.label.toLowerCase() === "flower inducer (ethrel)" && events) {
          const vege_event = events.find(p => p.className === 'vegetative');
          const date_diff = currDate - vege_event.end_time.toDate();

          if (farm.plantNumber - farm.ethrel === 0) {
            setSaving(false);
            handleModalClose();
            setAlert({
              visible: true,
              message: "Hindi ka na puwedeng magdagdag ng Ethrel",
              severity: "warning",
              vertical: 'top',
              horizontal: 'center',
            });
            return;
          }
          if (!ethrelValid(currDate, vege_event.start_time.toDate())) {
            setSaving(false);
            handleModalClose();
            setAlert({
              visible: true,
              message: "Hindi ka puwedeng maglagay ng Ethrel",
              severity: "warning",
              vertical: 'top',
              horizontal: 'center',
            });
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
                break;
              default:
                break;
            }
          }
          // Update farm with ethrel count
          console.log("the billaaannggg", bilang)
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
              qnty: qnty,
              desc: ''
            }
          );

          const pComp = components.find(c => c.name === theLabel.label)
          const actComp = {
            ...pComp,
            qntyPrice: comps.qntyPrice,
            totalPrice: comps.qntyPrice * pComp.price,
            type: "a"
          }
          setActualComponents([...components.filter(comp => comp.type !== 'p'), actComp]);
          const newCompAct = await addDoc(componentsColl, actComp)
          await updateDoc(newCompAct, { id: newCompAct.id })
          setSaving(false);
          setAlert({
            visible: true,
            message: `Ikaw ay naglagay ng ethrel ngayong ${moment(currDate).format('MMM DD, YYYY')}`,
            severity: "success",
            vertical: 'bottom',
            horizontal: 'left',
          });
          handleModalClose();
        } else {
          await addDoc(activityColl,
            {
              type: act,
              createdAt: currDate,
              label: theLabel.label,
              compId: fertilizer,
              qnty: qnty,
              desc: ''
            }
          );

          const pComp = components.find(c => c.name === theLabel.label)
          const actComp = {
            ...pComp,
            qntyPrice: comps.qntyPrice,
            totalPrice: comps.qntyPrice * pComp.price,
            type: "a"
          }
          setActualComponents([...components.filter(comp => comp.type !== 'p'), actComp]);
          const newCompAct = await addDoc(componentsColl, actComp)
          await updateDoc(newCompAct, { id: newCompAct.id })
        }
      }

      setSaving(false);
      setAlert({
        visible: true,
        message: `Ikaw ay nakapaglagay ng fertilizer ngayong ${moment(currDate).format('MMM DD, YYYY')}`,
        severity: "success",
        vertical: 'bottom',
        horizontal: 'center',
      });
      handleModalClose();
    } catch (error) {
      console.error('error updating document', error);
      setSaving(false);
      setAlert({
        visible: true,
        message: "May error sa pag-update ng dokumento",
        severity: "error",
        vertical: 'top',
        horizontal: 'center',
      });
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


  return (
    <View style={styles.container}>
      <View style={{ display: 'flex', gap: 2, flexDirection: 'row', justifyContent: 'space-between', }}>
        <TouchableOpacity onPress={() => setIsAdd(true)} style={{ ...styles.addButton, flex: 1 }}>
          <Text style={styles.addButtonText}>Add Activities</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setReport(true)} style={{ ...styles.addButton, backgroundColor: 'red', flex: 1 }}>
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
            <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 15, marginBottom: 5 }}>Fertilizer:</Text>
            <Dropdown
              data={ferti}
              labelField="label"
              valueField="value"
              placeholder="Select Fertilizer"
              value={fertilizer}
              style={styles.input}
              onChange={item => {
                const obj = components?.find(obj => obj.name === item.value)
                setFertilizer(item.value)
                setComps(obj)
                setBilang((parseInt(farm.plantNumber) - parseInt(farm.ethrel)).toString())
              }}
            />
            {
              fertilizer.toLocaleLowerCase() === "flower inducer (ethrel)" &&
              <View style={styles.quantyContainer}>
                 <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 15, marginBottom: 5 }}>Plant Number:</Text>
                <TextInput
                  placeholder="Bilang ng tanim"
                  keyboardType="numeric"
                  style={{ ...styles.input, borderColor: bilangError ? 'red' : '#ccc' }}
                  value={bilang}
                  onChangeText={handleBilang}
                />
              </View>
            }
            <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 15, marginBottom: 5 }}>Quantity:</Text>
            <View style={styles.quantyContainer}>
              <TextInput
                placeholder="0.0"
                keyboardType="numeric"
                style={styles.input}
                value={comps.qntyPrice.toString()}
                onChangeText={(e) => {
                  const parsedValue = parseFloat(e) || 0;  // Handle NaN when input is empty or invalid
                  console.log("theeee whatt???", parsedValue)
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
              <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 15, marginBottom: 5 }}>Title:</Text>
              <TextInput
                // label='Title'
                // placeholder='Title'
                onChangeText={(e) => setReportTitle(e)}
                style={{ ...styles.input, borderColor: bilangError ? 'red' : '#ccc' }}
              />
              <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 15, marginBottom: 5 }}>Description:</Text>
              <TextInput
                editable
                multiline
                numberOfLines={4}
                // maxLength={60}
                // placeholder='Description'
                onChangeText={(e) => setReportDesc(e)}
                style={{ ...styles.input, borderColor: bilangError ? 'red' : '#ccc' }}
              />
              <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 15, marginBottom: 5 }}>Percentage of Damage:</Text>
              <View style={styles.quantyContainer}>
                <TextInput
                  placeholder="0"
                  keyboardType="numeric"
                  style={styles.input}
                  value={reportPer}
                  onChangeText={handleRepPer}
                />
                <View style={styles.suffixContainer}>
                  <Text style={styles.suffix}>%</Text>
                </View>
              </View>
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', alignContent: 'center', gap: 2, width: '100%' }}>
              <TouchableOpacity onPress={handleModalClose} style={styles.cancelButton2}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              {
                components && roi &&
                <TouchableOpacity
                  onPress={() => handleSave("r")}
                  style={[styles.ReportButton, saving && { backgroundColor: 'gray' }]}
                  disabled={saving}
                >
                  <Text style={styles.saveButtonText}>{saving ? 'Saving...' : 'Report'}</Text>
                </TouchableOpacity>
              }
            </View>
          </View>
        </View>

      </Modal>
      {/* <Alert {...alert}/> */}
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
});

export default Activities;
