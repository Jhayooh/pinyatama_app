import { LinearGradient } from "expo-linear-gradient";
import { signOut } from "firebase/auth";
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import {
    Dimensions,
    Image,
    ImageBackground,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { auth } from '../firebase/Config';
import Login from './Login';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const ButtonContainer = ({ navigation }) => {
    const [showModal, setShowModal] = useState(false)

    const [user] = useAuthState(auth)
    console.log(user);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                setShowModal(false)
            }
        })

        return unsubscribe
    }, [])

    const handleSignOut = () => {
        signOut(auth)
            .then(() => {
                console.log('Signed Out');
            })
            .catch(e => alert(e.message))

    }
    return (
        <>
            <View style={styles.buttonContainer}>
                <View style={styles.row}>
                    <TouchableOpacity style={styles.button} onPress={() =>
                        user
                            ?
                            navigation.navigate('Calculator')
                            :
                            setShowModal(true)
                    }>
                        <Image source={require('../assets/calc.png')} style={{ width: 60, height: 80 }} />
                        <Text style={styles.buttonText}>Kalkulador ng gastos</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => null}>
                        <Image source={require('../assets/yield.png')} style={styles.buttonImage} />
                        <Text style={styles.buttonText}>Tagapagukit ng ani</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.row}>
                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Gallery')}>
                        <Image source={require('../assets/gal.png')} style={styles.buttonImage} />
                        <Text style={styles.buttonText}>Mga bukid ng pinya</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Video')}>
                        <Image source={require('../assets/vid.png')} style={{ width: 60, height: 80 }} />
                        <Text style={styles.buttonText}>Mga Bidyo</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.row}>
                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Inputs')}>
                        <Image source={require('../assets/info.png')} style={{ width: 80, height: 80 }} />
                        <Text style={styles.buttonText}>Tungkol</Text>
                    </TouchableOpacity>
                    {
                        user
                            ?
                            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Register')}>
                                <Image source={require('../assets/user.png')} style={{ width: 70, height: 80 }} />
                                <Text style={styles.buttonText}>Logout</Text>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity style={styles.button} onPress={() => setShowModal(true)}>
                                <Image source={require('../assets/user.png')} style={{ width: 70, height: 80 }} />
                                <Text style={styles.buttonText}>Login</Text>
                            </TouchableOpacity>
                    }
                </View>
            </View>
            <Modal animationType='fade' transparent={true} visible={showModal} onRequestClose={() => (setShowModal(!showModal))}>
                <Login showModal={showModal} setShowModal={setShowModal} />
            </Modal>
        </>
    );
};

export const Landing = ({ navigation }) => {
    const handleShow = () => {
        // Logic for showing something
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'android' ? 'padding' : 'height'}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={styles.container}>
                <ImageBackground source={require('../assets/brakrawnd.png')}style={styles.imgBackground}> 
                    <LinearGradient
                        colors={["#48F10E", "#078716", "#093203"]}
                        style={styles.gradient}
                    >
                    <Image source={require('../assets/pinya.png')} style={styles.logo} />
                    <Text style={styles.text}>Queen Pineapple Farming</Text>
                    <ButtonContainer navigation={navigation} />
                    </LinearGradient>
                    </ImageBackground>
                    {/* <Image source={require('../assets/eclipse.png')} style={styles.overlayOval} />
                        <Image source={require('../assets/pinya.png')} style={styles.overlayLogo} /> */}

                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex:1,
        alignItems: 'center',
        justifyContent:'center',
        backgroundColor: '#fff',
    },
    gradient:{
        position: 'absolute',
        alignItems: "center", 
        justifyContent: 'center',
        width:'100%',
        height:'40%',
        opacity:0.95,
        borderBottomLeftRadius: windowWidth * 0.3,
        borderBottomRightRadius: windowWidth * 0.3,
    },
    imgBackground: {
        flex: 1,
        width: "100%",
        alignItems: "center",
      },
    logo: {
        width: windowWidth * 0.2,
        height: windowWidth * 0.2,
        marginTop: windowHeight * 0.01,
    },
    text: {
        color: 'white',
        fontFamily: 'serif',
        textAlign: 'center',
        fontSize: windowWidth * 0.1,

        marginTop: windowHeight * 0.,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        gap: windowWidth * 0.05
    },
    buttonContainer: {
        marginTop: windowHeight * 0.1,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        zIndex: 2,
        paddingTop: windowHeight * 0.9,
        elevation: 50,
    }
    ,
    button: {
        marginBottom: windowWidth * 0.02,
        width: windowWidth * 0.4,
        height: windowHeight * 0.2,
        padding: windowWidth * 0.02,
        alignItems: 'center',
        justifyContent: 'center',
        opacity:1,
        shadowColor: '#171717',
        shadowOffset: {
            width: 0,
            height: windowWidth * 0.03,
        },
        shadowOpacity: 0.37,
        shadowRadius: windowWidth * 0.05,
        backgroundColor: 'white',
        borderRadius: windowWidth * 0.05,
        borderWidth: windowWidth * 0.01,
        borderColor:'white',
        // borderColor: '#008B00',
        overflow: 'hidden',
    },
    buttonImage: {
        width: '50%',
        height: '50%'
    },
    buttonText: {
        color: '#206830',
        textAlign: 'center',
        fontSize: 18,
        fontFamily: 'serif',
        fontStyle: 'italic',

    },
});
