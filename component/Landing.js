import React from 'react'
import { Text, View, Button, StyleSheet, ImageBackground, TouchableOpacity , Image} from 'react-native'

const ButtonContainer = ({ navigation }) => {
    return (
        <View style={styles.buttonContainer}>
            <View style={styles.row}>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Calculator')}>
                    <Image source={require('../assets/calcu.png')}/>
                    <Text style={styles.buttonText}>CALCULATOR NG GASTOS</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ProductionInput')}>
                    <Image source={require('../assets/yield.png')}/>
                    <Text style={styles.buttonText}>TAGAPAG-UKIT NG ANI</Text>
                </TouchableOpacity>
               
            </View>
            <View style={styles.row}>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Map')}>
                    <Image source={require('../assets/gal.png')}/>
                    <Text style={styles.buttonText}>MGA BUKID NG PINYA</Text>
                </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Video')}>
                    <Image source={require('../assets/video.png')}/>
                    <Text style={styles.buttonText}>BIDYO</Text>
            </TouchableOpacity>

            </View>
            <View style={styles.row}>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('About')}>
                    <Image source={require('../assets/about.png')}/>
                    <Text style={styles.buttonText}>TUNGKOL</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
                    <Image source={require('../assets/login.png')}/>
                    <Text style={styles.buttonText}>LOG IN</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};
export const Landing = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <ImageBackground source={require('../assets/brakrawnd.png')}  style={styles.background}></ImageBackground> 
           
            <Image source={require('../assets/white.png')}style={styles.overlayImage} />
            <Image source={require('../assets/pik.png')}style={styles.overlayPik} />
            <ButtonContainer navigation={navigation} />
            
        </View>
        
    );
};

const styles = StyleSheet.create({
    case:{
        backgroundColor:'#17AF41'
    },
    container: {
        flex: 1,
        backgroundColor: '#206830',
    },
    background: {
        width: 700,
        height: 1000,
        resizeMode: 'cover',
    },
    buttonContainer: {
     
        flexDirection: 'column',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        marginTop: 400,
        position: 'absolute',
        width: '100%', // or specify a fixed width
        height: '50%', // or specify a fixed height
        resizeMode: 'cover',
        opacity: 0.9, // adjust opacity as needed
        zIndex: 2, // ensure the overlay is above the background
        
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
       
        
    },
    button: {
        width: 180,
        height: 130,
        padding: 5,
        backgroundColor:'#1E6738',
        borderRadius:10,
        borderWidth: 1,
        shadowColor: '#1D4927',
        borderColor: '#1D4927',
        alignItems: 'center',
        justifyContent: 'center',
    },
    overlayImage: {
        position: 'absolute',
        top: 60,
        left: 10,
        width: '95%', // or specify a fixed width
        height: '90%', // or specify a fixed height
        resizeMode: 'cover',
        opacity: 1.0, // adjust opacity as needed
        zIndex: 1, // ensure the overlay is above the background
        borderRadius: 20,
      },
      overlayPik: {
        position: 'absolute',
        top: 60,
        left: 10,
        width: '95%', // or specify a fixed width
        height: '30%', // or specify a fixed height
        resizeMode: 'cover',
        opacity: 0.9, // adjust opacity as needed
        zIndex: 2, // ensure the overlay is above the background
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20
      },
    label: {

    }
}
)