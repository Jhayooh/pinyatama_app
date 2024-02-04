import React from 'react'
import { Text, View, Button, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native'

const testButton = [
    "CALCULATOR NG GASTOS",
    "TAGAPAG-UKIT NG ANI",
    "MGA BUKID NG PINYA",
    "BBIDYO",
    "TUNGKOL",
    "LOG IN"
]

const ButtonContainer = ({ navigation }) => {
    return (
        <View style={styles.buttonContainer}>
            {testButton.map((title, index) => (
                <TouchableOpacity key={index} style={styles.button} onPress={()=>{
                    switch (index) {
                        case 0:
                            navigation.navigate('Map')
                            break;
                        case 1:
                            navigation.navigate('ProductionInput')
                        default:
                            break;
                    }
                }} >
                    <Text>{title}</Text>
                </TouchableOpacity>
            ))}
        </View>
    )
}

export const Landing = ({ navigation }) => {
  return (
    <View style={styles.container}>
        <ImageBackground source={require('../assets/brakrawnd.png')} resizeMode="cover" style={styles.image}>
            <ButtonContainer navigation={navigation} />
        </ImageBackground>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#206830',
    },
    image: {
        flex: 1,
        opacity: .8,
        paddingVertical: 36,
        paddingHorizontal: 12,
    },
    buttonContainer: {
        padding: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap'
    },
    button: {
        width: 180,
        height: 90,
        padding: 12,
        marginBottom: 12,
        backgroundColor:'#1E6738',
        borderRadius:10,
        borderWidth: 1,
        shadowColor: '#1D4927',
        borderColor: '#1D4927',
        alignItems: 'center',
        justifyContent: 'center',
    },
    label: {

    }
}
)