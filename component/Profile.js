import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Divider, NativeBaseProvider, Input } from "native-base";


const Profile = () => {
    return (
        <View style={styles.container}>
            <View style={styles.section}>
                <View style={styles.subsection}>
                    <Text style={{color:'green', alignItems:'center', fontSize:20, fontWeight:'bold', marginBottom:20}}>Impormasyon ng Bukid</Text>
                    
                    <View style={{ flexDirection: 'column', gap: 1, marginBottom:20  }}>
                        <Text style={styles.supText}>Field ID</Text>
                        <Input
                            editable
                            placeholder='Field ID'
                        />
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ flex: 1, flexDirection: 'column', marginRight: 5, marginBottom:20 }}>
                            <Text style={styles.supText}>Pangalan ng Magsasaka</Text>
                            <Input
                                editable
                                placeholder='Name'
                                style={{ width: '100%' ,}}
                            />
                        </View>
                        <View style={{ flex: 1, flexDirection: 'column', marginLeft: 5, marginBottom:20  }}>
                            <Text style={styles.supText}>Kasarian</Text>
                            <Input
                                editable
                                placeholder='Sex'
                                style={{ width: '100%' }}
                            />
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ flex: 1, flexDirection: 'column', marginRight: 5, marginBottom:20  }}>
                            <Text style={styles.supText}>Barangay</Text>
                            <Input
                                editable
                                placeholder='Name'
                                style={{ width: '100%' }}
                            />
                        </View>
                        <View style={{ flex: 1, flexDirection: 'column', marginLeft: 5, marginBottom:20  }}>
                            <Text style={styles.supText}>Municipality</Text>
                            <Input
                                editable
                                placeholder='Sex'
                                style={{ width: '100%' }}
                            />
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ flex: 1, flexDirection: 'column', marginRight: 5 }}>
                            <Text style={styles.supText}>Bilang ng Tanim</Text>
                            <Input
                                editable
                                placeholder='Name'
                                style={{ width: '100%' }}
                            />
                        </View>
                        <View style={{ flex: 1, flexDirection: 'column', marginLeft: 5 }}>
                            <Text style={styles.supText}>Land Area</Text>
                            <Input
                                editable
                                placeholder='Sex'
                                style={{ width: '100%' }}
                            />
                        </View>
                    </View>
                </View>
            </View>



        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10
    },
    section: {
        // backgroundColor: 'red',
        paddingTop: 30,
        paddingBottom: 14,
        paddingHorizontal: 15,
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
    supText: {
        color: '#070707',
        fontSize: 12,
        fontWeight: '500',
        marginBottom: 4
      },
})

export default () => {
    return (
        <NativeBaseProvider>
            <View style={{ flex: 1, px: '3' }}>
                <Profile />
            </View>
        </NativeBaseProvider>
    )
}

