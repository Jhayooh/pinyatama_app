import React from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    StyleSheet
} from "react-native";
import { useState } from "react";

import { TableBuilder } from "./TableBuilder";


export const PlantNum = ({ navigation, route }) => {
    //const { farm = {}, compData = {} } = route.params
    const [roiDetails, setRoiDetails] = useState({})

 

    return (
        <>
            <View style={styles.section}>
                <Text style={styles.header}> CALCULATE </Text>
                <Text style={styles.supText}> Number of Plants</Text>
                <View style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
                    <TextInput
                        editable
                        onChangeText={(base) => {
                            setBase(base)
                            setArea(base / 30000)
                            setTable(false)
                        }}
                        ref={focusNumplants}
                        placeholder='Enter Number of Plants'
                        keyboardType='numeric'
                        value={base}
                        style={calculateFocus ? { ...styles.textInputFocus, borderBottomRightRadius: 0, borderTopRightRadius: 0 } : { ...styles.textInput, borderBottomRightRadius: 0, borderTopRightRadius: 0 }}
                        onFocus={() => setCalculateFocus(true)}
                        onBlur={() => setCalculateFocus(false)}
                    />
                    {
                        lParti && calculating
                            ?
                            <ActivityIndicator style={{ flex: 1 }} size='small' color='#FF5733' />
                            :
                            <TouchableOpacity onPress={() => {
                                setCalculating(true)
                                handleBase()
                            }} style={{ ...styles.button, backgroundColor: '#F5C115', borderBottomLeftRadius: 0, borderTopLeftRadius: 0, paddingHorizontal: 22, paddingVertical: 0, justifyContent: 'center' }}>
                                <Image source={require('../assets/calc.png')} style={{}} />

                            </TouchableOpacity>
                    }
                </View>
                {table && qPine && <TableBuilder components={components} area={area} setRoiDetails={setRoiDetails} pineapple={qPine} />}
            </View >
        </>
    )
}
const styles = StyleSheet.create({
    section: {
        // backgroundColor: 'red',
        paddingTop: 32,
        paddingBottom: 14,
        paddingHorizontal: 20,
        borderRadius: 12,
        marginTop: 16,
        backgroundColor: '#FFF',
        marginHorizontal: 16,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
        elevation: 2,
    },
    subsection: {
        marginBottom: 22,
    },
    header: {
        fontSize: 20,
        fontWeight: '700',
        color: '#4DAF50',
        marginBottom: 14,
    },
    supText: {
        color: '#070707',
        fontSize: 12,
        fontWeight: '500',
        marginBottom: 4
    },
    button: {
        backgroundColor: '#4DAF50',
        alignItems: 'center',
        padding: 12,
        borderRadius: 8,
    },
    textInputFocus: {
        flex: 1,
        height: 46,
        opacity: 1.0,
        borderColor: '#F5C115',
        borderWidth: 1.6,
        backgroundColor: '#FBFBFB',
        borderRadius: 8,
        paddingHorizontal: 18,
        color: '#3C3C3B',
        fontSize: 16,
        shadowColor: "#F5C115",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
    },
    textInput: {
        flex: 1,
        height: 46,
        opacity: 1.0,
        borderColor: '#E8E7E7',
        borderWidth: 1,
        backgroundColor: '#FBFBFB',
        borderRadius: 8,
        paddingHorizontal: 18,
        color: '#3C3C3B',
        fontSize: 16,
    },
})