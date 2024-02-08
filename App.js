import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProductionInput from './component/ProductionInput';
import { Landing } from './component/Landing';
import { Calculator } from './component/Calculator';
import Map from './component/Map'
import Charts from './component/Charts';
import { ImageBackground, StyleSheet } from 'react-native';

const Stack = createNativeStackNavigator();

const App = () => (
    <NavigationContainer>
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}>
            <Stack.Screen name='Landing' component={Landing} />
            <Stack.Screen name='Calculator' component={Calculator} />
            <Stack.Screen name='ProductionInput' component={ProductionInput} />
            <Stack.Screen name='Map' component={Map} />
            <Stack.Screen name='Charts' component={Charts} />
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