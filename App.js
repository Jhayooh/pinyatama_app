import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import About from './component/About';
import { BottomButton } from './component/BottomButton';
import { Calculator } from './component/Calculator';
import Charts from './component/Charts';
import DataInputs from './component/DataInputs';
import Gallery from './component/Gallery';
import Inputs from './component/Inputs';
import { Landing } from './component/Landing';
import Map from './component/Map';
import ProductionInput from './component/ProductionInput';
import Register from './component/Register';
import Video from './component/Video';
import Edit from './component/Edit'
import { Button } from 'native-base';
import YieldPredictor from './component/YieldPredictor'
import { EditProfile } from './component/EditProfile';
import Timeline from './component/charts/Timeline';
import Activities from './component/Activities';
import ImagesTab from './component/ImagesTab';
import Profile from './component/Profile';

const Stack = createNativeStackNavigator();

const App = () => (
    <NavigationContainer>
        <Stack.Navigator
            screenOptions={{
                headerShown: true
            }}>
            <Stack.Screen name='Landing' component={Landing}
                options={{
                    headerShown: false
                }} />
            <Stack.Screen
                name='Calculator'
                component={Calculator}
                options={{
                    title: 'Kalkulador ng Gastos',
                    headerTintColor: '#E8E7E7',
                    headerBackTitleVisible: false,
                    headerStyle: {
                        backgroundColor: '#4DAF50',
                    }
                }}
            />
            <Stack.Screen
                name='Edit'
                component={Edit}
                options={{
                    title: 'Edit Inputs',
                    headerTintColor: '#E8E7E7',
                    headerBackTitleVisible: false,
                    headerStyle: {
                        backgroundColor: '#4DAF50',
                    }
                }}
            />
            <Stack.Screen
                name='ProductionInput'
                component={ProductionInput}
                options={{
                    title: 'Input ng Produksyon',
                    headerTintColor: '#E8E7E7',
                    headerBackTitleVisible: false,
                    headerStyle: {
                        backgroundColor: '#4DAF50',
                    }
                }}
            />
            <Stack.Screen name='Map' component={Map} />
            <Stack.Screen
                name='Gallery'
                component={Gallery}
                options={{
                    title: 'Mga Sakahan',
                    headerTintColor: '#E8E7E7',
                    headerBackTitleVisible: false,
                    headerStyle: {
                        backgroundColor: '#4DAF50',
                    }
                }}
            />
            <Stack.Screen
                name='About'
                component={About}
                options={{
                    title: 'Tungkol sa QP Farming',
                    headerTintColor: '#E8E7E7',
                    headerBackTitleVisible: false,
                    headerStyle: {
                        backgroundColor: '#4DAF50',
                    }
                }}
            />
            <Stack.Screen
                name='Video'
                component={Video}
                options={{
                    title: 'Bidyu',
                    headerTintColor: '#E8E7E7',
                    headerBackTitleVisible: false,
                    headerStyle: {
                        backgroundColor: '#4DAF50',
                    }
                }}
            />

            <Stack.Screen
                name='Yield'
                component={YieldPredictor}
                options={{
                    title: 'Bilang ng Inaasahang Ani',
                    headerTintColor: '#E8E7E7',
                    headerBackTitleVisible: false,
                    headerStyle: {
                        backgroundColor: '#4DAF50',
                    }
                }}
            />

            <Stack.Screen
                name='Register'
                component={Register}
                options={{
                    title: 'Gumawa ng Account',
                    headerTintColor: '#E8E7E7',
                    headerBackTitleVisible: false,
                    headerStyle: {
                        backgroundColor: '#4DAF50',
                    }
                }}
            />

            <Stack.Screen
                name='Extensionist'
                component={EditProfile}
                options={{
                    title: 'Edit Personal Info',
                    headerTintColor: '#E8E7E7',
                    headerBackTitleVisible: false,
                    headerStyle: {
                        backgroundColor: '#4DAF50',
                    }
                }}
            />

            <Stack.Screen
                name='Activities'
                component={Activities}
                options={{
                    title: 'Mga Aktibidades',
                    headerTintColor: '#E8E7E7',
                    headerBackTitleVisible: false,
                    headerStyle: {
                        backgroundColor: '#4DAF50',
                    }
                }}
            />
            <Stack.Screen
                name='Images'
                component={ImagesTab}
                options={{
                    title: 'Mga Larawan ng Sakahan',
                    headerTintColor: '#E8E7E7',
                    headerBackTitleVisible: false,
                    headerStyle: {
                        backgroundColor: '#4DAF50',
                    }
                }}
            />      
            <Stack.Screen
            name='Profile'
            component={Profile}
            options={{
                title: 'Detalye ng Sakahan',
                headerTintColor: '#E8E7E7',
                headerBackTitleVisible: false,
                headerStyle: {
                    backgroundColor: '#4DAF50',
                }
            }}
        />

            <Stack.Screen name='Charts' component={Charts} />
            <Stack.Screen name='DataInputs' component={DataInputs} />
            <Stack.Screen name='BottomButton' component={BottomButton} />
            <Stack.Screen name='Timeline' component={Timeline} />
            <Stack.Screen name='Inputs' component={Inputs} />


        </Stack.Navigator>
    </NavigationContainer>
)

const styles = StyleSheet.create({
    image: {
        flex: 1,
        resizeMode: 'cover'
    }
})

export default App;