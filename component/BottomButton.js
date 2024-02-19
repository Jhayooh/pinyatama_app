import React from 'react'
import {
    View,
    TouchableOpacity,
    StyleSheet,
    Text,
    Alert
} from "react-native";

export const BottomButton = ({ setShow, navigation }) => {

    const handleSave = () => {
        Alert.alert('Data saved successfully',
        '',
        [
            {
                text: 'OK',
                onPress: () => navigation.navigate('Landing') 
            }
        ]);

    }

    return (
        <View style={styles.bottomButton}>
            <TouchableOpacity style={styles.bottomButtonItem} onPress={() => setShow(true)}>
                <Text>Add</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.bottomButtonItem} onPress={() => { handleSave() }}>
                <Text>Save</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    bottomButton: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        gap: 12
    },
    bottomButtonItem: {
        backgroundColor: '#3bcd6b',
        flex: 1,
        padding: 12,
        alignItems: 'center'
    },
})
