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

    // React.useEffect(() => {
    //     navigation.setOptions({
    //         headerRight: () => (
    //             <TouchableOpacity
    //                 title='Save'>
    //                 <View style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row', gap: 1 }}>
    //                     {/* <Image source={require('../assets/edit.png')} style={{ width: 20, height: 20 }} /> */}
    //                     <Text style={{ color: 'white', fontSize: 20 }}>Save</Text>
    //                 </View>
    //             </TouchableOpacity>
    //         )
    //     })
    // })

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
                            <ScrollView>
                                {qPine && <TableBuilder components={comp} area={farm.area} setRoiDetails={setRoiDetails} pineapple={qPine} setComponents={setComp} soil={farm.soil} />}
                            </ScrollView>
                        )}
                    </Tab.Screen>
                    {/* <Tab.Screen
                        name="Activities"
                        component={Activities}
                        options={{ tabBarLabel: 'Activities' }}
                        initialParams={{
                            farm: farm,
                        }}
                    /> */}
                    {/* <Tab.Screen
                        name="Report"
                        component={Report}
                        options={{ tabBarLabel: 'Report' }}
                    /> */}
                </Tab.Navigator>
            }
        </>
    )
}

export default Edit;