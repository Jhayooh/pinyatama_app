import React, { useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, Modal, TextInput, ScrollView, Alert } from 'react-native';

const Report = () => {
    const [text, onChangeText] = React.useState('');


    return (
        <View style={styles.container}>
            <SafeAreaView>
                <View>
                    <Text style={styles.title}>Titlle:</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={onChangeText}
                        placeholder="Enter Report Title"
                    />
                </View>
                <View>
                    <Text style={styles.title}>Description:</Text>
                    <TextInput
                        style={styles.description}
                        onChangeText={onChangeText}
                        placeholder="Enter Description"
                    />
                </View>
                <View>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>
                        Send Report
                    </Text>
                </TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,

    },
    title: {
        fontSize: 20,
        fontFamily: 'serif',
        color: 'green'
    },
    input: {
        height: "50",
        margin: 5,
        borderWidth: 1,
        padding: 10,
        fontSize: 18,
        borderColor: 'green'
    },
    description: {
        height: "70%",
        margin: 5,
        borderWidth: 1,
        padding: 2,
        fontSize: 15,
        borderColor: 'green'
    },
    button: {
        backgroundColor: 'red',
        padding: 10,
        alignItems: 'center'
    },
    buttonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold'
    }

})

export default Report;
