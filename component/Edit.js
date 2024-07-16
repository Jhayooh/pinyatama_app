import React, { useState } from "react";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, ScrollView, View, Image } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

//components
import Charts from './Charts';
import Profile from './Profile';
import Images from './ImagesTab';
import { TableBuilder } from './TableBuilder';
import Activities from './Activities';

const Tab = createMaterialTopTabNavigator();

const Edit = ({ route, navigation }) => {
    const { farm = {}, compData = {} } = route.params

    farm && console.log("farm sa edit", farm)
    const [roiDetails, setRoiDetails] = useState({})

    React.useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    title='Save'>
                    <View style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row', gap: 1 }}>
                        {/* <Image source={require('../assets/edit.png')} style={{ width: 20, height: 20 }} /> */}
                        <Text style={{ color: 'white', fontSize: 20 }}>Save</Text>
                    </View>
                </TouchableOpacity>
            )
        })
    })

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
                                <TableBuilder components={compData} area={farm.area} setRoiDetails={setRoiDetails} />
                            </ScrollView>
                        )}
                    </Tab.Screen>
                    <Tab.Screen
                        name="Activities"
                        component={Activities}
                        options={{ tabBarLabel: 'Activities' }}
                    />
                </Tab.Navigator>
            }
        </>
    )
}

export default Edit;