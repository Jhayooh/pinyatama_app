import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import {
    Image,
    ImageBackground,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { auth } from '../firebase/Config';
import { useAuthState } from 'react-firebase-hooks/auth';
import { BottomButton } from './BottomButton';

const ButtonContainer = ({ navigation }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
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

    const handleSignUp = () => {
        createUserWithEmailAndPassword(auth, email, password)
            .then(userCredentials => {
                console.log('Registered with:', userCredentials.user.email);
            })
            .catch(error => alert(error.message))
    }

    const handleLogin = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then(userCredentials => {
                console.log('Logged in with:', userCredentials.user.email);
            })
            .catch(error => alert(error.message))
    }

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
                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Calculator')}>
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
                        <Text style={styles.buttonText}>BIDYO</Text>
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
                {/* login */}
            </Modal>
        </>
    );
};

export const Landing = ({ navigation }) => {
    const handleShow = () => {
        // Logic for showing something
    };

    return (
        <View style={styles.container}>
            <ImageBackground source={require('../assets/brakrawnd.png')} style={styles.background}></ImageBackground>
            <Image source={require('../assets/white.png')} style={styles.overlayImage} />
            <Image source={require('../assets/pik.png')} style={styles.overlayPik} />
            <ButtonContainer navigation={navigation} />
            <Image source={require('../assets/eclipse.png')} style={styles.overlayOval} />
            <Image source={require('../assets/pinya.png')} style={styles.overlayLogo} />
        </View>

    );
};

const styles = StyleSheet.create({
    case: {
        backgroundColor: '#17AF41'
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
        width: '100%', 
        height: '50%', 
        resizeMode: 'cover',
        opacity: 0.9,
        zIndex: 2, 

    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    buttonText: {
        color: 'black',
        textAlign: 'center',
    },
    button: {
        width: 150,
        height: 130,
        padding: 5,
        backgroundColor: '#17AF41',
        borderRadius: 20,
        borderWidth: 3,
        shadowColor: '#206830',
        borderColor: '#206830',
        alignItems: 'center',
        justifyContent: 'center',
    },
    overlayImage: {
        position: 'absolute',
        top: 60,
        left: 10,
        width: '95%', 
        height: '90%',
        resizeMode: 'cover',
        opacity: 1.0, 
        zIndex: 1, 
        borderRadius: 20,
    },
    overlayPik: {
        position: 'absolute',
        top: 60,
        left: 10,
        width: '95%', 
        height: '30%', 
        resizeMode: 'cover',
        opacity: 0.9,
        zIndex: 2, 
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20
    },
    overlayOval: {
        position: 'absolute',
        top: 200,
        left: 120,
        width: '45.5%', 
        height: '21.5%',
        opacity: 1.0, 
        zIndex: 3, 
    },
    overlayLogo: {
        position: 'absolute',
        top: 230,
        left: 125,
        width: '45%', 
        height: '15%', 
        opacity: 1.0, 
        zIndex: 4, 

    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    },
}
)
