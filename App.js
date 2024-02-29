import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet } from 'react-native';
import { BottomButton } from './component/BottomButton';
import { Calculator } from './component/Calculator';
import Charts from './component/Charts';
import DataInputs from './component/DataInputs';
import Gallery from './component/Gallery';
import Inputs from './component/Inputs';
import { Landing } from './component/Landing';
import Login from './component/Login';
import Map from './component/Map';
import ProductionInput from './component/ProductionInput';
import Register from './component/Register';
import Video from './component/Video';



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
            <Stack.Screen name='Gallery' component={Gallery} />
            <Stack.Screen name='Charts' component={Charts} />
            <Stack.Screen name='DataInputs' component={DataInputs} />
            <Stack.Screen name='BottomButton' component={BottomButton} />
            <Stack.Screen name='Login' component={Login} />
            <Stack.Screen name='Video' component={Video} />
            <Stack.Screen name='Register' component={Register} />
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