import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import StepIndicator from 'react-native-step-indicator';
import { Dropdown } from 'react-native-element-dropdown';
import moment from 'moment';
import { addDoc, collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
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

  const eventsColl = collection(db, `farms/${farm.id}/events`);
  const eventsQuery = query(eventsColl, orderBy('createdAt'));
  const [e] = useCollectionData(eventsQuery);

  const [dynamicSteps, setDynamicSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAdd, setIsAdd] = useState(false);
  const [fertilizer, setFertilizer] = useState('');
  const [quantity, setQuantity] = useState('');
  const [saving, setSaving] = useState(false);
  const [events, setEvents] = useState(null);
  const [ethrelAllowed, setEthrelAllowed] = useState(true);

  const [alert, setAlert] = useState({ visible: false, message: '', severity: '' });

  const handleChange = (text) => {
    if (/^\d*$/.test(text)) {
      setQuantity(text);
    }
  };

  const handleModalClose = () => {
    setIsAdd(false);
  };

  const formatDate = (date) => {
    return moment(date).format('MMM DD, YYYY');
  };

  useEffect(() => {
    // Fetch activities from Firestore and prepend the default step
    const unsubscribe = onSnapshot(activityQuery, (snapshot) => {
      const defaultStep = {
        text: "Pineapple has been planted",
        date: farm.start_date.toDate(),
      };

      if (!snapshot.empty) {
        const fetchedSteps = snapshot.docs.map((doc) => ({
          text: `${doc.data().qnty}kg, ${doc.data().label}`,
          date: doc.data().createdAt.toDate(),
        }));

        setDynamicSteps([defaultStep, ...fetchedSteps]);
      } else {
        setDynamicSteps([defaultStep]);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Check if ethrel should be available
    const currDate = new Date();
    const farmStartDate = new Date(farm.start_date.toDate());
    const monthsDifference = moment(currDate).diff(moment(farmStartDate), 'months');

    // Disable ethrel if it's less than 10 months since planting or if the current phase is vegetative
    const isVegetative = events && events.find(event => event.className === 'vegetative');
    if (monthsDifference < 10 || isVegetative) {
      setEthrelAllowed(false);
    } else {
      setEthrelAllowed(true);
    }
  }, [events, farm]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const currDate = new Date();
      const qnty = quantity;

      if (fertilizer.toLowerCase() === "flower inducer (ethrel)" && events) {
        if (!ethrelAllowed) {
          setSaving(false);
          setAlert({
            visible: true,
            message: "Hindi ka puwedeng maglagay ng Ethrel dahil hindi pa umaabot ng 10 buwan mula sa simula ng tanim o nasa vegetative phase pa.",
            severity: "warning",
            vertical: 'top',
            horizontal: 'center',
          });
          return;
        }

        // Continue with ethrel logic (event handling, adding to Firestore, etc.)
      } else {
        // Regular fertilizer addition logic
        await addDoc(activityColl, {
          createdAt: currDate,
          label: fertilizer,
          qnty: qnty,
        });

        setSaving(false);
        setAlert({
          visible: true,
          message: `Ikaw ay nakapaglagay ng fertilizer ngayong ${formatDate(currDate)}`,
          severity: "success",
          vertical: 'bottom',
          horizontal: 'center',
        });
        handleModalClose();
      }
    } catch (error) {
      console.error('Error updating document', error);
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
              data={ferti.filter(f => f.label !== 'Flower Inducer (ethrel)' || ethrelAllowed)} // Filter Ethrel based on the condition
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
                style={styles.quanInput}
                value={quantity}
                onChangeText={handleChange}
                step={0.01}
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
  quanInput: {
    flex: 1, 
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  quantyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    width: '100%',
  },
  suffixContainer: {
    position: 'absolute',
    right: 10, // Adjusts the position of the "kg"
    top: '50%',
    transform: [{ translateY: -10 }], // Center the text vertically
  },
  suffix: {
    fontSize: 16,
  },
});

export default Activities;
