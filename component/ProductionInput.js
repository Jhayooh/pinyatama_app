import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, ScrollView, View, Image, Modal } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Charts from './Charts';
import { useNavigation } from '@react-navigation/native';


//db
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { collection, doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/Config';

const Tab = createMaterialTopTabNavigator();

const ProductionInput = ({ route }) => {
  const [user] = useAuthState(auth)
  const { farm = [] } = route.params

  const componentsColl = collection(db, `farms/${farm.id}/components`)
  const [compData, compLoading, compError] = useCollectionData(componentsColl)

  const [visible, setVisible] = React.useState(false);
  const navigation = useNavigation();

  const handleNavigate = (screen, params = {}) => {
    setVisible(false);  // Close the modal when navigating
    navigation.navigate(screen, params);
  };
  const [cmplt, setCmplt] = useState(false)

  const handleCmplt = () => {
    if (farm.cropStage === 'complete') {
      setCmplt(true)
    }
  };
  useEffect(() => {
    handleCmplt();
  }, [farm.cropStage]);

  useEffect(() => {
    if (!user || !compData || cmplt) {
      return;
    }
    navigation.setOptions({
      headerRight: () => (
        <View style={{ display: 'flex', flexDirection: 'row', gap: 1 }}>

          <TouchableOpacity onPress={() => setVisible(true)} style={styles.menuButton}>
            <Image source={require('../assets/dots.png')} />
          </TouchableOpacity>

        </View>
      ),
    });
  }, [navigation, compData, user]);

  return (
    <>
      <SafeAreaView style={styles.container} onPress={() => setVisible(false)}>
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', gap: 3, marginLeft: 15 }}>
          <Text style={styles.name}>{farm.title}</Text>
        </View>
        <Text style={styles.location}>{`${farm.mun}, ${farm.brgy}`}</Text>
        <Charts farm={farm} />
      </SafeAreaView>

      <Modal
        transparent={true}
        visible={visible}
        // animationType="slide"
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={() => setVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleNavigate('Profile', { farm: farm })} style={styles.menuItem}>
              <Text style={styles.menuItemText}>Detalye ng Bukid</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleNavigate('Images', { farm: farm })} style={styles.menuItem}>
              <Text style={styles.menuItemText}>Mga Larawan ng Bukid</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleNavigate('Activities', { farm: farm })} style={styles.menuItem}>
              <Text style={styles.menuItemText}>Mga Aktibidad</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'green',
  },
  location: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 20
  },
  modalOverlay: {
    marginTop: 55,
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  modalContent: {
    // width: '80%',

    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    // alignItems: 'center',
  },
  menuItem: {
    padding: 10,
    width: '100%',
    // alignItems: 'flex-start',
  },
  menuItemText: {
    fontSize: 18,
  },
  closeButtonText: {
    color: 'red',
    fontSize: 20,
    alignSelf: 'flex-end',
    marginRight: 5
  },
});

export default ProductionInput;
