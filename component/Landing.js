import { LinearGradient } from "expo-linear-gradient";
import { signOut } from "firebase/auth";
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

import {
    Button,
    Dimensions,
    Image,
    ImageBackground,
    KeyboardAvoidingView,
    Modal,
    StyleSheet,
    Text,
    TouchableHighlight,
    TouchableOpacity,
    View,
    Alert,
    TextInput,
    FlatList,

} from 'react-native';
import { auth, db } from '../firebase/Config';

// logo
import appLogo from '../assets/pinyatamap-logo.png'
import calcLogo from '../assets/calc2.png'
import yieldLogo from '../assets/yield2.png'
import galleryLogo from '../assets/gal2.png'
import videoLogo from '../assets/vid2.png'
import aboutLogo from '../assets/info2.png'
import logonLogo from '../assets/user2.png'
import { addDoc, collection } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export const Landing = ({ navigation }) => {
    const [showLogin, setShowLogin] = useState(false)
    const [showRegister, setShowRegister] = useState(false)
    // const farmsColl = collection(db, 'farms')
    // const [farms] = useCollectionData(farmsColl) 
    const farms = [{
        "area": 1,
        "brgy": "Cobangbang (Carumpit)",
        "brgyUID": "MAicOo2SvfgMfg9cCVDwQks1gV72",
        "cropStage": "Vegetative",
        "farmerName": "Arjay Macalinao",
        "geopoint": { "latitude": 14.107196953701209, "longitude": 14.107196953701209 },
        "harvest_date": { "nanoseconds": 865000000, "seconds": 1711874130 },
        "id": "24T8wnmupy83QjTUWyLn",
        "images": [],
        "mun": "DAET (Capital)",
        "plantNumber": "30000",
        "sex": "yes",
        "start_date": {
            "nanoseconds": 865000000,
            "seconds": 1711874130
        },
        "title": "Animal Farm"
    }]

    const [user] = useAuthState(auth)


    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                setShowLogin(false)
            }
        })

        return unsubscribe
    }, [])

    const handleSignOut = () => {
        signOut(auth)
            .then(() => {
                setShowLogin(true)
            })
            .catch(e => alert(e.message))
    }

    const handleLogout = () => {
        Alert.alert('Signing Out', 'Your are about to sign out, haha sure ka sis?', [
            {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            {
                text: 'Yes',
                onPress: handleSignOut,
            }
        ])
    }

    const LoginModal = () => {
        const [email, setEmail] = useState('')
        const [password, setPassword] = useState('')

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
        return (
            <Modal animationType='fade' transparent={true} visible={showLogin} onRequestClose={() => (setShowLogin(false))}>
                <View style={loginStyle.container}>
                    <View style={loginStyle.formContainer}>
                        <View style={loginStyle.card}>
                            <Text style={loginStyle.title}>MALIGAYANG PAGDATING</Text>
                            <Text style={loginStyle.subtitle}>Mag Login sa iyong account</Text>
                            <View style={loginStyle.inputContainer}>
                                <TextInput
                                    style={loginStyle.input}
                                    value={email}
                                    onChangeText={text => setEmail(text)}
                                    placeholder="Email"
                                    placeholderTextColor="#999"
                                />
                            </View>
                            <View style={loginStyle.inputContainer}>
                                <TextInput
                                    style={loginStyle.input}
                                    value={password}
                                    onChangeText={text => setPassword(text)}
                                    placeholder="Password"
                                    placeholderTextColor="#999"
                                    secureTextEntry
                                />
                            </View>
                            <TouchableOpacity style={loginStyle.button} onPress={handleLogin} >
                                <Text style={loginStyle.buttonText}>Sign In</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={loginStyle.createAccountButton}>
                                <Text style={loginStyle.createAccountButtonText} onPress={() => {
                                    setShowLogin(false)
                                    navigation.navigate('Register')
                                }}>
                                    Create Account?</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }

    const RegistrationModal = () => {
        // Data pag register
        const [brgy, setBrgy] = useState('')
        const [disabled, setDisabled] = useState(false)
        const [firstName, setFirstName] = useState('');
        const [lastName, setLastName] = useState('');
        const [email, setEmail] = useState('')
        const [isRegistered, setIsRegistered] = useState(false)
        const [mun, setMun] = useState('')
        const [password, setPassword] = useState('')
        const [phoneNumber, setPhoneNumber] = useState('')
        const [photoUrl, setPhotoUrl] = useState(null)

        // changed
        const [baranggay, setBaranggay] = useState('');
        const [avatar, setAvatar] = useState(null);
        const [images, setImages] = useState([])
        const [city, setCity] = useState('');
        const [province, setProvince] = useState('');
        const [showAddImage, setShowAddImage] = useState(false)

        function formatNumber(pNum) {
            const cleanedNumber = pNum.replace(/\D/g, '');
            if (cleanedNumber.startsWith('0')) {
                return '+63' + cleanedNumber.slice(1);
            }
            console.log("the number", cleanedNumber);
            return cleanedNumber;
        }

        const handleRegister = async () => {
            const usersColl = collection(db, 'users')
            const [usersData, usersLoading, usersError] = useCollectionData(usersColl)
            try {
                const userRef = await addDoc(usersColl, {
                    brgy: brgy,
                    disabled: false,
                    displayName: firstName+lastName,
                    email: email, 
                    isRegistered: isRegistered,
                    mun: mun,
                    password: password,
                    phoneNumber: formatNumber(phoneNumber),
                    photoUrl: photoUrl,
                })

                await updateDoc(usersColl, {
                    uid: userRef.id
                })
            } catch (e) {
                console.log("error saving eh?:", e);
            }
        }

        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={showRegister}
                onRequestClose={() => setShowRegister(false)}
            >
                <View style={registerStyle.container}>
                    <View style={registerStyle.formContainer}>
                        <View style={registerStyle.card}>
                            <View style={{ marginBottom: 8, width: 180, height: 180, borderRadius: 90, overflow: 'hidden', backgroundColor: '#101010', alignItems: 'center' }}>
                                {
                                    images &&
                                    <Image source={{ uri: images.url }} style={{ height: '100%', width: 240, borderRadius: 6 }} />
                                }
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <TouchableOpacity style={registerStyle.touch} onPress={() => {
                                    setShowAddImage(true)
                                }}>
                                    <Text style={registerStyle.text}>Set Profile</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={registerStyle.inputContainer}>

                                <TextInput
                                    style={registerStyle.input}
                                    placeholder="First Name"
                                    value={firstName}
                                    onChangeText={text => setFirstName(text)}
                                />
                                <TextInput
                                    style={registerStyle.input}
                                    placeholder="Last Name"
                                    value={lastName}
                                    onChangeText={text => setLastName(text)}
                                />
                                <TextInput
                                    style={registerStyle.input}
                                    placeholder="Baranggay"
                                    value={baranggay}
                                    onChangeText={text => setBaranggay(text)}
                                />
                                <TextInput
                                    style={registerStyle.input}
                                    placeholder="City"
                                    value={city}
                                    onChangeText={text => setCity(text)}
                                />
                                <TextInput
                                    style={registerStyle.input}
                                    placeholder="Province"
                                    value={province}
                                    onChangeText={text => setProvince(text)}
                                />
                                <TextInput
                                    style={registerStyle.input}
                                    placeholder="Email"
                                    value={email}
                                    onChangeText={text => setEmail(text)}
                                />
                                <TextInput
                                    style={registerStyle.input}
                                    placeholder="Password"
                                    value={password}
                                    onChangeText={text => setPassword(text)}
                                    secureTextEntry
                                />
                            </View>
                            <TouchableOpacity style={registerStyle.button} onClick={() => {
                                Alert.alert(
                                    'Sign up account.',
                                    'are you sure you want to sign up this account?',
                                    [
                                        {
                                            text: 'Cancel',
                                            onPress: () => console.log('Cancel Pressed'),
                                            style: 'cancel',
                                        },
                                        {
                                            text: 'Yes',
                                            onPress: handleRegister,
                                        }
                                    ]
                                )
                            }}>
                                <Text style={registerStyle.buttonText}>Sign Up</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <Modal animationType='fade' visible={showAddImage} transparent={true}>
                        <View style={registerStyle.addImage}>
                            <TouchableOpacity style={registerStyle.touch} onPress={() => {
                                openGallery()
                            }}>
                                <Text style={registerStyle.text}>Gallery</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={registerStyle.touch} onPress={() => {
                                openCamera()
                            }}>
                                <Text style={registerStyle.text}>Camera</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={registerStyle.touch} onPress={() => {
                                setShowAddImage(!showAddImage)
                            }}>
                                <Text style={registerStyle.text}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                </View>
            </Modal>
        );
    }

    return (
        <>
            <View style={styles.bgOut}>
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
                                    setShowLogin(true)
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
                            <TouchableHighlight style={styles.btnbtn} onPress={() => { navigation.navigate('Gallery', { farms: farms }) }}>
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
                            <TouchableHighlight style={styles.btnbtn} onPress={() => null}>
                                <View style={styles.btnbtnChild}>
                                    <Image source={aboutLogo} style={styles.btnImage} />
                                    <Text style={styles.buttonText}>Tungkol</Text>
                                </View>
                            </TouchableHighlight>
                            {
                                user
                                    ?
                                    <TouchableHighlight style={styles.btnbtn} onPress={handleLogout}>
                                        <View style={styles.btnbtnChild2}>
                                            <Image source={logonLogo} style={styles.btnImage} />
                                            <Text style={{ ...styles.buttonText, color: '#fff' }}>Log out</Text>
                                        </View>
                                    </TouchableHighlight>
                                    :
                                    <TouchableHighlight style={styles.btnbtn} onPress={() => setShowLogin(true)}>
                                        <View style={styles.btnbtnChild}>
                                            <Image source={logonLogo} style={styles.btnImage} />
                                            <Text style={styles.buttonText}>Log in</Text>
                                        </View>
                                    </TouchableHighlight>

                            }
                        </View>
                    </View>
                </View>
            </View>
            <LoginModal />
            {/* <RegistrationModal /> */}
        </>
    );
}

const styles = StyleSheet.create({
    bgOut: {
        flex: 1,
        backgroundColor: '#22b14c',
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
        textAlign: 'center'
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
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.16,
        shadowRadius: 1.51,
        elevation: 1,
        borderRadius: 12,
        color: '#000',
    },
    btnbtnChild2: {
        backgroundColor: '#22b14c',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        shadowColor: "#000000",
        padding: 12,
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 1,
            height: 1,
        },
        shadowOpacity: 0.16,
        shadowRadius: 1.51,
        elevation: 1,
        borderRadius: 12,
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

const loginStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
    },
    background: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: 120,
    },

    formContainer: {
        justifyContent: 'center',
        alignItems: 'center',

        padding: 10
    },
    title: {
        color: 'orange',
        textAlign: 'center',
        marginBottom: 5,
        fontSize: 20,
        fontWeight: 'bold'

    },
    subtitle: {
        color: 'black',
        textAlign: 'center',
        marginBottom: 10,
    },
    card: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        padding: 20,
        marginBottom: 20,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        color: '#333',
    },
    input: {
        height: 40,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#ddd',
        color: '#333',
        paddingLeft: 10,
    },
    button: {
        width: '100%',
        height: 40,
        backgroundColor: 'green',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,

    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    createAccountButton: {
        marginTop: 10,
        textAlign: 'center'

    },
    createAccountButtonText: {
        color: 'green',
        fontSize: 15,
        fontWeight: 'bold',
        justifyContent: 'center'


    },
})

const registerStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',

    },
    background: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: 120,
    },
    logo: {
        width: 120,
        height: 120,
        borderRadius: 60,
        resizeMode: 'contain',
    },

    formContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        color: '#fff',
        marginBottom: 20,
        marginTop: 20,
    },
    card: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        padding: 20,
        marginBottom: 20,

    },
    inputContainer: {
        marginBottom: 10,

    },
    label: {
        fontSize: 16,
        color: '#333',
    },
    input: {
        height: 40,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#ddd',
        color: '#333',
        paddingLeft: 10,
        marginBottom: 10
    },
    button: {
        width: '100%',
        height: 40,
        backgroundColor: 'green',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    touch: {
        paddingHorizontal: 24,
        paddingVertical: 16,
        alignItems: 'center',
        textAlign: 'center',
        shadowOpacity: 0.37,
        shadowRadius: 7.49,
        elevation: 12,
        backgroundColor: '#17AF41',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#206830',
        flex: 1,
        alignItems: 'center',
        marginBottom: 10
    },
    text: {
        fontSize: 15,
        fontFamily: 'serif',
        fontWeight: 'bold',
        color: 'white'
    },
    addImage: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        flexDirection: 'row'
    },
})