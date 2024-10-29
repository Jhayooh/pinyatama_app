import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, ScrollView, View, Image } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Charts from './Charts';
import { Dropdown } from 'react-native-element-dropdown';

//db
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { collection, doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/Config';
import { Button } from 'native-base';

const Tab = createMaterialTopTabNavigator();

const moreOptions = [
  {
    label: 'Farm Profile', value: 'Profile'
  },
  {
    label: 'Gallery', value: 'Gallery'
  },
  {
    label: 'Cost and Return Analysis', value: 'CRA'
  },
  {
    label: 'Activities', value: 'Activities'
  },
  {
    label: 'Report', value: 'Report'
  }
]

const ProductionInput = ({ route, navigation }) => {
  const [edit, setEdit] = useState(false)
  const [user] = useAuthState(auth)

  const { farms = [] } = route.params
  const farm = farms[0]
  const [roiDetails, setRoiDetails] = useState({})
  const [options, setOptions] = useState()

  const componentsColl = collection(db, `farms/${farm.id}/components`)
  const [compData, compLoading, compError] = useCollectionData(componentsColl)

  React.useEffect(() => {
    if (!user || !compData) {
      return;
    }
    navigation.setOptions({
      headerRight: () => (
        <View style={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Activities', { farm: farm })}
            style={{
              backgroundColor: 'orange',
              padding: 10,
              borderRadius: 10,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
          >
            <Text style={{ color: '#fff', fontFamily: 'serif', fontWeight: 'bold' }}>Add Activities</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Edit', { farm: farm, compData: compData })}>
            <Image source={require('../assets/more.png')} style={{ width: 20, height: 20, marginTop: 10 }} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, compData, user]);

  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', gap: 3, marginLeft: 15 }}>
          <Text style={styles.name}>{farm.title}</Text>
        </View>
        <Text style={styles.location}>{`${farm.mun}, ${farm.brgy}`}</Text>
        <Charts farms={farms} />
      </SafeAreaView>
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
});

export default ProductionInput;
