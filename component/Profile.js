import React from 'react';
import { View, StyleSheet, ScrollView, TextInput, Text, TouchableOpacity } from 'react-native';

export default function Profile({ route, navigation }) {
    const { farm } = route.params

    farm && console.log("Farm sa profile", farm)


    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.section}>
                    <View style={styles.subsection}>
                        <Text style={{ color: 'green', alignItems: 'center', fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>Impormasyon ng Bukid</Text>
                        <View style={{ flexDirection: 'column', gap: 1, marginBottom: 20 }}>
                            <Text style={styles.supText}>Field ID</Text>
                            <TextInput
                                editable={false}
                                placeholder={farm.fieldId}
                                style={styles.textInput}
                            />
                        </View>
                        <View style={{ flexDirection: 'column', gap: 1, marginBottom: 20 }}>
                            <Text style={styles.supText}>Pangalan ng Bukid</Text>
                            <TextInput
                                editable
                                placeholder={farm.title}
                                style={{ ...styles.textInput, borderColor: 'green' }}
                            />
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <View style={{ flex: 1, flexDirection: 'column', marginRight: 5, marginBottom: 20 }}>
                                <Text style={styles.supText}>Pangalan ng Magsasaka</Text>
                                <TextInput
                                    editable
                                    placeholder={farm.farmerName}
                                    style={{ ...styles.textInput, borderColor: 'green' }}
                                />
                            </View>
                            <View style={{ flex: 1, flexDirection: 'column', marginLeft: 5, marginBottom: 20 }}>
                                <Text style={styles.supText}>Kasarian</Text>
                                <TextInput
                                    editable
                                    placeholder={farm.sex}
                                    style={{ ...styles.textInput, width: '100%', borderColor: 'green' }}
                                />
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <View style={{ flex: 1, flexDirection: 'column', marginRight: 5, marginBottom: 20 }}>
                                <Text style={styles.supText}>Barangay</Text>
                                <TextInput
                                    editable
                                    placeholder={farm.brgy}
                                    style={{ ...styles.textInput, width: '100%', borderColor: 'green' }}
                                />
                            </View>
                            <View style={{ flex: 1, flexDirection: 'column', marginLeft: 5, marginBottom: 20 }}>
                                <Text style={styles.supText}>Municipality</Text>
                                <TextInput
                                    editable
                                    placeholder={farm.mun}
                                    style={{ ...styles.textInput, width: '100%', borderColor: 'green' }}
                                />
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <View style={{ flex: 1, flexDirection: 'column', marginRight: 5, marginBottom: 20 }}>
                                <Text style={styles.supText}>Bilang ng Tanim</Text>
                                <TextInput
                                    editable
                                    placeholder={farm.plantNumber}
                                    style={{ ...styles.textInput, width: '100%', borderColor: 'green' }}
                                />
                            </View>
                            <View style={{ flex: 1, flexDirection: 'column', marginLeft: 5, marginBottom: 20 }}>
                                <Text style={styles.supText}>Land Area</Text>
                                <TextInput
                                    editable
                                    placeholder={farm.area}
                                    style={{ ...styles.textInput, width: '100%', borderColor: 'green' }}
                                />
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <View style={{ flex: 1, flexDirection: 'column', marginRight: 5, marginBottom: 20 }}>
                                <Text style={styles.supText}>Klase ng Lupa</Text>
                                <TextInput
                                    editable
                                    placeholder={farm.soil}
                                    style={{ ...styles.textInput, borderColor: 'green' }}
                                />
                            </View>
                            <View style={{ flex: 1, flexDirection: 'column', marginLeft: 5, marginBottom: 20 }}>
                                <Text style={styles.supText}>NPK</Text>
                                <TextInput
                                    editable
                                    placeholder={farm.npk}
                                    style={{ ...styles.textInput, width: '100%', borderColor: 'green' }}
                                />
                            </View>

                        </View>
                    </View>

                </View>
                <View>
                    <TouchableOpacity style={styles.saveButton}>
                        <Text style={styles.save}>Save</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10
    },
    section: {
        // backgroundColor: 'red',
        paddingHorizontal: 15,
        paddingTop: 30,
        paddingBottom: 14,
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
        marginBottom: 10
    },
    subsection: {
        marginBottom: 22,
    },
    supText: {
        color: '#070707',
        fontSize: 12,
        fontWeight: '500',
        marginBottom: 4
    },
    textInput: {
        flex: 1,
        height: 46,
        opacity: 1.0,
        borderColor: '#E8E7E7',
        borderWidth: 1.6,
        backgroundColor: '#FBFBFB',
        borderRadius: 8,
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
    saveButton: {
        backgroundColor: '#52be80',
        borderRadius: 8,
        padding: 12,
        alignSelf: 'flex-end',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        margin: 10,
        paddingHorizontal:50,
        marginHorizontal:16,
    },
    save: {
        color: '#fff',
        fontSize: 20,
    }

})