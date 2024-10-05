import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, ScrollView, Alert } from 'react-native';
import StepIndicator from 'react-native-step-indicator';
// import Carousel from 'react-native-snap-carousel';
// import Doughnut from '../chart/Doughnut'; // Ensure you have the correct library for charts

const steps = ["Step 1", "Step 2", "Step 3", "Step 4"];

const customStyles = {
  stepIndicatorSize: 30,
  currentStepIndicatorSize: 40,
  separatorStrokeWidth: 2,
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
  currentStepLabelColor: '#fe7013'
};

const Activities = ({ roi }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAdd, setIsAdd] = useState(false);
  const [fertilizer, setFertilizer] = useState('');
  const [quantity, setQuantity] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    if (fertilizer && quantity) {
      setTimeout(() => {
        setSaving(false);
        setIsAdd(false);
        Alert.alert("Success", "Activity added successfully!");
      }, 1000);
    } else {
      setSaving(false);
      Alert.alert("Error", "Please fill in all the fields.");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setIsAdd(true)}
        style={styles.addButton}
      >
        <Text style={styles.addButtonText}>Add Activities</Text>
      </TouchableOpacity>
      <StepIndicator
        customStyles={customStyles}
        currentPosition={currentStep}
        stepCount={steps.length}
        labels={steps}
        direction='vertical'
      />


      {/* <ScrollView style={{ marginTop: 20 }}>
        <Text style={styles.stepText}>Activity Details for {steps[currentStep]}</Text>
      </ScrollView> */}
      {/* 
      <TouchableOpacity
        onPress={() => setCurrentStep((currentStep + 1) % steps.length)}
        style={styles.nextButtonContainer}
      >
        <Text style={styles.nextButton}>Next</Text>
      </TouchableOpacity>

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
            <TextInput
              placeholder="Fertilizer Name"
              style={styles.input}
              value={fertilizer}
              onChangeText={setFertilizer}
            />
            <TextInput
              placeholder="Quantity"
              keyboardType="numeric"
              style={styles.input}
              value={quantity}
              onChangeText={setQuantity}
            />
            <View style={{ display: 'flex', flexDirection: 'row', alignContent: 'center', gap: 2 , width:'100%'}}>
              <TouchableOpacity
                onPress={() => setIsAdd(false)}
                style={styles.cancelButton}
              >
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

      {/* Carousel for ROI */}
      {/* <Carousel
        data={roi}
        renderItem={({ item }) => (
          <View>
            <Doughnut
              data={[item.netReturn, item.costTotal]}
              labels={["Net Return", "Production Cost"]}
            />
          </View>
        )}
        sliderWidth={300}
        itemWidth={300}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  stepText: {
    marginVertical: 20,
    fontSize: 18,
    textAlign: 'center',
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
  nextButtonContainer: {
    backgroundColor: '#fe7013',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: 'center',
    marginTop: 20,
  },
  nextButton: {
    color: '#fff',
    fontSize: 18,
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
    flex:1
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
    flex:1
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default Activities;
