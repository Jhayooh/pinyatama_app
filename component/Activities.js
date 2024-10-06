import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import StepIndicator from 'react-native-step-indicator';
import { Dropdown } from 'react-native-element-dropdown';
import moment from 'moment';
import { addDoc, collection, query, orderBy, onSnapshot } from 'firebase/firestore'; // added onSnapshot
import { db } from '../firebase/Config';
import { useCollectionData } from 'react-firebase-hooks/firestore';

const ferti = [
  { label: 'Ammouphus (16-20-0)', value: 'Ammouphus (16-20-0)' },
  { label: 'Muriate of Potash (0-0-60)', value: 'Muriate of Potash (0-0-60)' },
  { label: 'Urea Granular (46-0-0)', value: 'Urea Granular (46-0-0)' },
  { label: 'Water Soluble Calcium Nitrate (17-0-17)', value: 'Water Soluble Calcium Nitrate (17-0-17)' },
  { label: 'Flower Inducer (ethrel)', value: 'Flower Inducer (ethrel)' },
];

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

const Activities = ({ route }) => {
  const { farm } = route.params;

  const activityColl = collection(db, `farms/${farm.id}/activities`);
  const activityQuery = query(activityColl, orderBy('createdAt'));

  const eventsColl = collection(db, `farms/${farm.id}/events`)
  const eventsQuery = query(eventsColl, orderBy('createdAt'))
  const [e] = useCollectionData(eventsQuery)

  const [dynamicSteps, setDynamicSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAdd, setIsAdd] = useState(false);
  const [fertilizer, setFertilizer] = useState('');
  const [quantity, setQuantity] = useState('');
  const [saving, setSaving] = useState(false);
  const [events, setEvents] = useState(null)

  const [alert, setAlert] = useState({ visible: false, message: '', severity: '' });


  const handleChange = (text) => {
    if (/^\d*$/.test(text)) {
      setQuantity(text);
    }
  };
  const handleModalClose = () => {
    setIsAdd(false);
};


  // Fetch activities from Firestore and prepend the default step
  useEffect(() => {
    const unsubscribe = onSnapshot(activityQuery, (snapshot) => {
      // Default step
      const defaultStep = {
        text: "Pineapple has been planted",
        date: farm.start_date.toDate(),
      };

      if (!snapshot.empty) {
        const fetchedSteps = snapshot.docs.map((doc) => ({
          text: `${doc.data().qnty}kg, ${doc.data().label}`,
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

  const handleSave = async () => {
    setSaving(true);
    try {
      const currDate = new Date();
      const theLabel = ferti.find(obj => obj.value === fertilizer); // Find the selected fertilizer object
      const qnty = quantity; // Use the entered quantity

      if (theLabel.label.toLowerCase() === "flower inducer (ethrel)" && events) {
        const vege_event = events.find(p => p.className === 'vegetative');
        console.log("1");

        const date_diff = currDate - vege_event.end_time.toDate();
        console.log("2");

        if (farm.plantNumber - farm.ethrel === 0) {
          console.log("a");
          await delay(1000);
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
        console.log("4");

        if (!ethrelValid(currDate, vege_event.start_time.toDate())) {
          console.log("b");
          await delay(1000);
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

        console.log("5");
        for (const e of events) {
          switch (e.className.toLowerCase()) {
            case 'vegetative':
              console.log("c");
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
              console.log("d");
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
              console.log("e");
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
              console.log("f");
              break;
          }
        }

        await addDoc(activityColl, {
          createdAt: currDate,
          label: theLabel.label,
          compId: fertilizer,
          qnty: qnty,
        });

        console.log("i");

        // Update farm with ethrel count
        await updateDoc(doc(db, `farms/${farm.id}`), {
          isEthrel: currDate,
          ethrel: farm.ethrel + farm.plantNumber,
        });

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
        await addDoc(activityColl, {
          createdAt: currDate,
          label: theLabel.label,
          compId: fertilizer,
          qnty: qnty,
        });

        setSaving(false);
        setAlert({
          visible: true,
          message: `Ikaw ay nakapaglagay ng fertilizer ngayong ${moment(currDate).format('MMM DD, YYYY')}`,
          severity: "success",
          vertical: 'bottom',
          horizontal: 'center',
        });
        handleModalClose();
      }
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


  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setIsAdd(true)} style={styles.addButton}>
        <Text style={styles.addButtonText}>Add Activities</Text>
      </TouchableOpacity>

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
            <Dropdown
              data={ferti}
              labelField="label"
              valueField="value"
              placeholder="Select Fertilizer"
              value={fertilizer}
              style={styles.input}
              onChange={item => setFertilizer(item.value)}
            />
            <View style={styles.quantyContainer}>
              <TextInput
                placeholder="0"
                keyboardType="numeric"
                style={styles.input}
                value={quantity}
                onChangeText={handleChange}
              />
              <View style={styles.suffixContainer}>
                <Text style={styles.suffix}>kg</Text>
              </View>
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', alignContent: 'center', gap: 2, width: '100%' }}>
              <TouchableOpacity onPress={() => setIsAdd(false)} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSave}
                style={[styles.saveButton, saving && { backgroundColor: 'gray' }]}
                disabled={saving}
              >
                <Text style={styles.saveButtonText}>{saving ? 'Saving...' : 'Save'}</Text>
              </TouchableOpacity>
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
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  dateColumn: {
    justifyContent: 'flex-start',
    marginLeft: 10, // Add spacing between the step indicator and dates
  },
  dateText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 20, // Space out the dates
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
