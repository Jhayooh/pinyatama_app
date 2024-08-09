import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const steps = ["Step 1", "Step 2", "Step 3", "Step 4"];

const Activities = () => {
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <View style={styles.container}>
      <View style={styles.stepper}>
        {steps.map((step, index) => (
          <View key={index} style={styles.stepContainer}>
            <View style={[
              styles.step,
              index === currentStep && styles.currentStep
            ]}>
              <Text style={styles.stepLabel}>{index + 1}</Text>
            </View>
            {index < steps.length - 1 && <View style={styles.separator} />}
          </View>
        ))}
      </View>
      <Text style={styles.stepText}>{steps[currentStep]}</Text>
      <TouchableOpacity onPress={() => setCurrentStep((currentStep + 1) % steps.length)}>
        <Text style={styles.nextButton}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    padding: 20,
  },
  stepper: {
    flexDirection: 'column',
    //alignItems: 'center',
  },
  stepContainer: {
    flexDirection: 'column',
    //alignItems: 'center',
  },
  step: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#cccccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  currentStep: {
    backgroundColor: '#fe7013',
  },
  stepLabel: {
    color: '#ffffff',
  },
  separator: {
    width: 2,
    height: 20,
    backgroundColor: '#cccccc',
  },
  stepText: {
    marginVertical: 20,
    fontSize: 18,
  },
  nextButton: {
    color: '#fe7013',
    fontSize: 18,
  },
});

export default Activities;
