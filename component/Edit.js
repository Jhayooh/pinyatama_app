import React, { useState } from "react";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, ScrollView, View, Image } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { collection } from 'firebase/firestore';
import { db } from "../firebase/Config";

//components
import Charts from './Charts';
import Profile from './Profile';
import Images from './ImagesTab';
import { TableBuilder } from './TableBuilder';
import Activities from './Activities';
import Report from './Report'

const Tab = createMaterialTopTabNavigator();

const Edit = ({ route, navigation }) => {
    const { farm = {}, compData = {} } = route.params

    farm && console.log("farm sa edit", farm)
    const [comp, setComp] = useState(compData)
    const [roiDetails, setRoiDetails] = useState({})
    const quertyPine = collection(db, 'pineapple');
    const [qPine, lPine, ePine] = useCollectionData(quertyPine)

    return (
        <>
            {
                Object.keys(farm).length != 0 &&
                <Tab.Navigator
                    initialRouteName="Profile"
                    tabBarOptions={{
                        activeTintColor: 'green',
                        labelStyle: { fontSize: 11, fontWeight: 'bold' },
                        style: { backgroundColor: 'white' },
                    }}
                >
                    <Tab.Screen
                        name="Profile"
                        component={Profile}
                        options={{ tabBarLabel: 'Profile' }}
                        initialParams={{
                            farm: farm
                        }}
                    />

                    <Tab.Screen
                        name="Images"
                        component={Images}
                        options={{ tabBarLabel: 'Images' }}
                        initialParams={{
                            farm: farm,

                        }}
                    />
                    <Tab.Screen
                        name="CostAndReturn"
                        options={{ tabBarLabel: 'Cost and Return' }}
                    >
                        {() => (
                            <View style={{padding:10, backgroundColor:'#fff'}}>
                                <ScrollView style={{ height: '90%' }}>
                                    {qPine && <TableBuilder components={comp} area={farm.area} setRoiDetails={setRoiDetails} pineapple={qPine} setComponents={setComp} soil={farm.soil} />}
                                </ScrollView>
                                <TouchableOpacity style={styles.saveButton}>
                                    <Text style={styles.save}>Save</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </Tab.Screen>

                </Tab.Navigator>
            }
        </>
    )
}

export default Edit;

const styles = StyleSheet.create({
    saveButton: {
        backgroundColor: '#52be80',
        borderRadius: 8,
        padding: 12,
        alignSelf: 'flex-end',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        margin: 10,
        paddingHorizontal: 50,
        marginHorizontal: 16,
    },
    save: {
        color: '#fff',
        fontSize: 20,
    }
})