import { LinearGradient } from 'expo-linear-gradient';
import { signOut } from "firebase/auth";
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

import {
    Dimensions,
    Image,
    Modal,
    StyleSheet,
    Text,
    TouchableHighlight,
    View
} from 'react-native';
import { auth } from '../firebase/Config';
import Login from './Login';


// logo
import calcLogo from '../assets/calc2.png';
import galleryLogo from '../assets/gal2.png';
import aboutLogo from '../assets/info2.png';
import appLogo from '../assets/pinyatamap-logo.png';
import logonLogo from '../assets/user2.png';
import videoLogo from '../assets/vid2.png';
import yieldLogo from '../assets/yield2.png';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export const Landing = ({ navigation }) => {
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
             <LinearGradient
                colors={['green', '#4caf50','yellow','orange','yellow' ]}
                style={styles.bgOut}
            >
                <View style={styles.logoBg} >
                    <Text style={styles.appTitle} >Queen Pineapple Farming</Text>
                </View>
                
                <View style={styles.btnBg}>
                    <Image source={appLogo} style={styles.appLogo} />
                    <View style={styles.btnContainer}>
                        <View style={styles.btnRow}>
                            <TouchableHighlight style={styles.btnbtn} onPress={() =>
                                user
                                    ?
                                    navigation.navigate('Calculator')
                                    :
                                    setShowModal(true)
                            }>
                                <View style={styles.btnbtnChild}>
                                    <Image source={calcLogo} style={styles.btnImage} />
                                    <Text style={styles.buttonText}>Kalkulador ng gastos</Text>
                                </View>
                            </TouchableHighlight>
                            <TouchableHighlight style={styles.btnbtn}>
                                <View style={styles.btnbtnChild}>
                                    <Image source={yieldLogo} style={styles.btnImage} />
                                    <Text style={styles.buttonText}>Tagapagukit ng Pinya</Text>
                                </View>
                            </TouchableHighlight>
                        </View>
                        
                        <View style={styles.btnRow}>
                            <TouchableHighlight style={styles.btnbtn} onPress={() => navigation.navigate('Gallery')}>
                                <View style={styles.btnbtnChild}>
                                    <Image source={galleryLogo} style={styles.btnImage} />
                                    <Text style={styles.buttonText}>Mga Bukid ng Pinya</Text>
                                </View>
                            </TouchableHighlight>
                            <TouchableHighlight style={styles.btnbtn} onPress={() => navigation.navigate('Video')}>
                                <View style={styles.btnbtnChild}>
                                    <Image source={videoLogo} style={styles.btnImage} />
                                    <Text style={styles.buttonText}>Mga Bidyo</Text>
                                </View>
                            </TouchableHighlight>
                        </View>
                        <View style={styles.btnRow}>
                            <TouchableHighlight style={styles.btnbtn} onPress={() => navigation.navigate('About')}>
                                <View style={styles.btnbtnChild}>
                                    <Image source={aboutLogo} style={styles.btnImage} />
                                    <Text style={styles.buttonText}>Tungkol</Text>
                                </View>
                            </TouchableHighlight>
                            <TouchableHighlight style={styles.btnbtn} onPress={() => setShowModal(true)}>
                                {user
                                    ?
                                    <View style={styles.btnbtnChild2}>
                                        <Image source={logonLogo} style={styles.btnImage} />
                                        <Text style={{...styles.buttonText, color: '#fff'}}>Log out</Text>
                                    </View>
                                    :
                                    <View style={styles.btnbtnChild}>
                                        <Image source={logonLogo} style={styles.btnImage} />
                                        <Text style={styles.buttonText}>Log in</Text>
                                    </View>
                                }
                            </TouchableHighlight>
                        </View>
                    </View>
                </View>
                </LinearGradient>

            <Modal animationType='fade' transparent={true} visible={showModal} onRequestClose={() => (setShowModal(!showModal))}>
                <Login showModal={showModal} setShowModal={setShowModal} />
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    bgOut: {
        flex: 1, 
        justifyContent: 'space-between'
    },
    btnBg: {
        backgroundColor: '#f9fafb',
        height: '65%',
        width: '100%',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        alignItems: 'center',
        justifyContent: 'flex-end',
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 18,
        },
        shadowOpacity: 0.25,
        shadowRadius: 32,
        elevation: 24
    },
    logoBg: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    appLogo: {
        width: 128,
        height: 128,
        padding: 12,
        position: 'absolute',
        top: -64
    },
    appTitle: {
        fontSize: 48,
        color: '#fff',
        fontWeight: '600',
        textAlign: 'center',
        fontFamily:'serif'
    },
    btnContainer: {
        flex: 1,
        marginTop: 72,
        width: '100%',
        padding: 12,
        paddingHorizontal: 24,
        flexDirection: 'column',
        gap: 12,
        marginBottom: 12,

    },
    btnRow: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        // backgroundColor: 'blue',
        gap: 12
    },
    btnbtn: {
        flex: 1,
    },
    btnbtnChild: {
        backgroundColor: '#fff',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        shadowColor: "green",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.16,
        shadowRadius: 1.51,
        elevation: 1,
        color: 'white',
        borderColor:'green'
    },
    btnbtnChild2: {
        backgroundColor: '#22b14c',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.16,
      
        elevation: 1,
        
    },
    btnImage: {
        width: 64,
        height: 64
    },
    buttonText: {
        fontSize: 18,
        textAlign: 'center',
        fontFamily: 'serif',
        fontStyle: 'italic',
    }
})
