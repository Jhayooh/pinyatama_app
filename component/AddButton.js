import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

export const AddButton = ({ setShow, navigation }) => {

    return (
        <View style={styles.bottomButton}>
            <TouchableOpacity style={styles.bottomButtonItem} onPress={() => setShow(true)}>
                <Text style={styles.text}>Add Activities </Text>
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
     
        paddingVertical: 16,
        textAlign: 'center',
        shadowOpacity: 0.37,
        shadowRadius: 7.49,
        elevation: 20,
        backgroundColor: '#ffff',
     
        borderWidth: 1,
        borderColor: '#206830',
    },
    text: {
        color: 'black',
        fontSize: 15,
        fontWeight: 'bold',
        fontFamily:'serif'
    
    }
})
