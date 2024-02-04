import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProductionInput from './component/ProductionInput';
import { Landing } from './component/Landing';
import { Calculator } from './component/Calculator';

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
        </Stack.Navigator>
    </NavigationContainer>
)

export default App;