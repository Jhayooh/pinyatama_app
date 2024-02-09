import React from 'react'
import {
    View,
    TouchableOpacity,
    StyleSheet,
    Text
} from "react-native";

export const BottomButton = ({ setShow }) => {

    const handleSave = () => {

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
