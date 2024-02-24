import React from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
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
                <Text style={styles.text}>ADD </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.bottomButtonItem} onPress={() => { handleSave() }}>
                <Text style={styles.text}>SAVE</Text>
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
        flex: 1,
        padding: 12,
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 16,
        textAlign: 'center',
        shadowOpacity: 0.37,
        shadowRadius: 7.49,
        elevation: 20,
        backgroundColor: '#17AF41',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#206830',
    },
    text: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily:'serif'
    
    }
})
