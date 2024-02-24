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
                        user ? navigation.navigate('Calculator') : setShowModal(true)
                    }>
                        <Image source={require('../assets/calcu.png')} />
                        <Text style={styles.buttonText}>CALCULATOR NG GASTOS</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ProductionInput')}>
                        <Image source={require('../assets/yield.png')} />
                        <Text style={styles.buttonText}>TAGAPAG-UKIT NG ANI</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.row}>
                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Gallery')}>
                        <Image source={require('../assets/gal.png')} />
                        <Text style={styles.buttonText}>MGA BUKID NG PINYA</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Gallery')}>
                        <Image source={require('../assets/video.png')} />
                        <Text style={styles.buttonText}>MGA BIDYO</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.row}>
                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Tungkol')}>
                        <Image source={require('../assets/about.png')} />
                        <Text style={styles.buttonText}>TUNGKOL</Text>
                    </TouchableOpacity>
                    {
                        user
                            ?
                            <TouchableOpacity style={styles.button} onPress={() => handleSignOut()}>
                                <Image source={require('../assets/login.png')} />
                                <Text style={styles.buttonText}>LOG OUT</Text>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity style={styles.button} onPress={() => setShowModal(true)}>
                                <Image source={require('../assets/login.png')} />
                                <Text style={styles.buttonText}>LOG IN</Text>
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
                    <ImageBackground source={require('../assets/brakrawnd.png')} style={styles.background} />
                    <Image source={require('../assets/white.png')} style={styles.overlayImage} />
                    <Image source={require('../assets/pik.png')} style={styles.overlayPik} />
                    <ButtonContainer navigation={navigation} />
                    <Image source={require('../assets/eclipse.png')} style={styles.overlayOval} />
                    <Image source={require('../assets/pinya.png')} style={styles.overlayLogo} />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#206830',
        justifyContent: 'center',
        alignItems: 'center',
    },
    background: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    buttonContainer: {
        justifyContent: 'space-between',
        position: 'absolute',
        width: '100%',
        height: '50%',
        opacity: 0.9,
        zIndex: 2,
        marginTop: 300,
        paddingVertical: windowHeight * 0.20,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        gap: 12,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 18,
        fontFamily: 'serif'
    },
    button: {
        marginTop: 10,
        marginBottom: 5,
        width: 150,
        height: 130,
        padding: 5,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#17AF41',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.37,
        shadowRadius: 7.49,
        elevation: 12,
        // Background Gradient
        backgroundColor: '#17AF41',
        borderRadius: 20,
        borderWidth: 3,
        borderColor: '#206830',
        overflow: 'hidden',
    },
    gradient: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    overlayImage: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: windowWidth * 0.95,
        height: windowHeight * 0.9,
        resizeMode: 'cover',
        opacity: 1.0,
        zIndex: 1,
        borderRadius: 20,
        marginLeft: -((windowWidth * 0.95) / 2),
        marginTop: -((windowHeight * 0.9) / 2),
    },
    overlayPik: {
        position: 'absolute',
        top: windowHeight * 0.06,
        left: '2.5%',
        width: windowWidth * 0.95,
        height: windowHeight * 0.3,
        opacity: 0.9,
        zIndex: 2,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
    },
    overlayOval: {
        position: 'absolute',
        top: '35%',
        left: '50%',
        width: windowWidth * 0.455,
        height: windowHeight * 0.225,
        marginLeft: -((windowWidth * 0.455) / 2),
        marginTop: -((windowHeight * 0.215) / 2),
        opacity: 1.0,
        zIndex: 3,
        shadowOpacity: 10.0,
        shadowRadius: 10.0,


    },
    overlayLogo: {
        position: 'absolute',
        top: '35%',
        left: '50%',
        width: windowWidth * 0.45,
        height: windowHeight * 0.15,
        marginLeft: -((windowWidth * 0.45) / 2),
        marginTop: -((windowHeight * 0.15) / 2),
        opacity: 1.0,
        zIndex: 4,
        shadowOpacity: 0.37,
        shadowRadius: 7.49,

    },

});

