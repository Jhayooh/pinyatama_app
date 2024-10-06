import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import StepIndicator from 'react-native-step-indicator';
import { Dropdown } from 'react-native-element-dropdown';
import moment from 'moment';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase/Config';

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
  const [dynamicSteps, setDynamicSteps] = useState([{ text: "Pineapple has been planted", date: farm.start_date.toDate() }]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAdd, setIsAdd] = useState(false);
  const [fertilizer, setFertilizer] = useState('');
  const [quantity, setQuantity] = useState('');
  const [saving, setSaving] = useState(false);

  // const activityColl = collection(db, `farms/${farm.id}/activities`)
  // const activityQuery = query(activityColl, orderBy('createdAt'))
  // const [activities] = useCollectionData(activityQuery)

  const handleChange = (text) => {
    if (/^\d*$/.test(text)) {
      setQuantity(text);
    }
  };

  const handleSave = () => {
    setSaving(true);
    if (fertilizer && quantity) {
      setTimeout(() => {
        const newStep = {
          text: `${quantity}kg, ${fertilizer},`,
          date: new Date(),
        };
        setDynamicSteps(prevSteps => [...prevSteps, newStep]);
        setSaving(false);
        setIsAdd(false);
        setFertilizer('');
        setQuantity('');
        Alert.alert("Success", "Activity added successfully!");
      }, 1000);
    } else {
      setSaving(false);
      Alert.alert("Error", "Please fill in all the fields.");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setIsAdd(true)} style={styles.addButton}>
        <Text style={styles.addButtonText}>Add Activities</Text>
      </TouchableOpacity>

      <View style={styles.stepContainer}>
        <View style={{ flex: 1 }}>
          <StepIndicator
            customStyles={customStyles}
            currentPosition={currentStep}
            stepCount={dynamicSteps.length}
            labels={dynamicSteps.map(step => step.text)}
            direction='vertical'
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
              labelField='label'
              valueField='value'
              placeholder='Select Fertilizer'
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
