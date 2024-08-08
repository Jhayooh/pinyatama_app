import React from "react";
import { Text, View, TextInput, StyleSheet } from "react-native";
import { Divider } from 'react-native-paper';

//db
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { collection } from 'firebase/firestore';
import { db } from "../firebase/Config";

export const EditProfile = ({ navigation, route }) => {
    const { logUser } = route.params

    console.log('useeeerrrsss sa edit', logUser)

    return (
        <>
            {
                logUser &&
                <View style={styles.container}>
                    <View style={styles.subContainer}>
                        <Text style={styles.title}>Firstname</Text>
                        <TextInput
                            editable
                            style={styles.textInput}
                            placeholder={logUser?.logUser.firstname}
                        />
                    </View>
                    <View style={styles.subContainer}>
                        <Text style={styles.title}>Lastname</Text>
                        <TextInput
                            editable
                            style={styles.textInput}
                            placeholder={logUser?.logUser.lastname}
                        />
                    </View>
                    <Divider style={styles.divider}/>
                    <View style={styles.subContainer}>
                        <Text style={styles.title}>Municipality</Text>
                        <TextInput
                            editable
                            style={styles.textInput}
                            placeholder={logUser?.logUser.mun}
                        />
                    </View>
                    <View style={styles.subContainer}>
                        <Text style={styles.title}>Barangay</Text>
                        <TextInput
                            editable
                            style={styles.textInput}
                            placeholder={logUser?.logUser.brgy}
                        />
                    </View>
                    <Divider style={styles.divider}/>
                    <View style={styles.subContainer}>
                        <Text style={styles.title}>Email</Text>
                        <TextInput
                            editable
                            style={styles.textInput}
                            placeholder={logUser?.logUser.email}
                        />
                    </View>
                    <View style={styles.subContainer}>
                        <Text style={styles.title}>Password</Text>
                        <TextInput
                            editable
                            style={styles.textInput}
                            placeholder={logUser?.logUser.password}
                        />
                    </View>
                </View>
            }
        </>
    )
}
const styles = StyleSheet.create({
    container: {
        padding: 30,
        backgroundColor: '#fff',
        height: '100%'
    },
    subContainer: {
        flexDirection: 'column',
    },
    title: {
        color: '#070707',
        fontSize: 12,
        fontWeight: '500',
        marginBottom: 4
    },
    textInput: {
        height: 40,
        opacity: 1.0,
        borderColor: '#E8E7E7',
        borderWidth: 1.6,
        backgroundColor: '#FBFBFB',
        borderRadius: 20,
        paddingHorizontal: 18,
        color: '#3C3C3B',
        fontSize: 16,
        // shadowColor: "#F5C115",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
    },
    divider:{
        margin:5
    }

})