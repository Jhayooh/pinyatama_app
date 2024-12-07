import { LinearGradient } from "expo-linear-gradient";
import { signOut } from "firebase/auth";
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { Avatar } from "native-base";
import { Divider } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
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
    DrawerLayoutAndroid,
    TouchableWithoutFeedback,
    ActivityIndicator,
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

    const usersColl = collection(db, 'users')
    const [users] = useCollectionData(usersColl)

    const farmsColl = collection(db, 'farms')
    const [farms] = useCollectionData(farmsColl)

    const [user] = useAuthState(auth)

    const drawer = useRef(null);
    const [drawerPosition, setdrawerPosition] = useState('left')


    const logUser = user && users?.find(item => item.id === user.uid)

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
        Alert.alert('Signing Out', 'Are you sure you want to sign out to this account?', [
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
        const [emailError, setEmailError] = useState(false)
        const [saving, setSaving] = useState(false)
        const [modalUser, setModalUser] = useState(null)
        const [welcome, setWelcome] = useState(false)
        const [isPasswordVisible, setIsPasswordVisible] = useState(false);

        const togglePasswordVisibility = () => {
            setIsPasswordVisible(!isPasswordVisible);
        };

        const handleSignUp = () => {
            createUserWithEmailAndPassword(auth, email, password)
                .then(userCredentials => {
                    console.log('Registered with:', userCredentials.user.email);
                })
                .catch(error => alert(error.message))
        }

        const handleEmail = (email) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (emailRegex.test(email)) {
                setEmailError(false);
            } else {
                setEmailError(true);
            }

            setEmail(email.toLowerCase());
        };


        const handleLogin = () => {
            setSaving(true);
            signInWithEmailAndPassword(auth, email, password)
                .then(async userCredentials => {
                    const u = users.find(u => u.id === userCredentials.user.uid);

                    if (u) {
                        if (u.status === "blocked") {
                            Alert.alert('Account Blocked', 'Your account has been blocked. Please contact support.');
                            await auth.signOut();
                            setSaving(false);
                            return;
                        }
                        if (u.status === "pending") {
                            Alert.alert('Pending Account', 'Your account is pending. Please wait for approval');
                            await auth.signOut();
                            setSaving(false);
                            return;
                        }
                        console.log("user", u);
                        setModalUser(u);
                        setSaving(false);
                    } else {
                        Alert.alert('User Not Found', 'No user data found. Please contact support.');
                        setSaving(false);
                    }
                })
                .catch(error => {
                    switch (error.code) {
                        case 'auth/invalid-email':
                            Alert.alert('Invalid Email', 'Please enter a valid email address.');
                            break;
                        case 'auth/user-disabled':
                            Alert.alert('Account Disabled', 'This account has been disabled. Contact support.');
                            break;
                        case 'auth/user-not-found':
                            Alert.alert('User Not Found', 'No account found with this email.');
                            break;
                        case 'auth/wrong-password':
                            Alert.alert('Invalid Password', 'The password you entered is incorrect.');
                            break;
                        case 'auth/too-many-requests':
                            Alert.alert('Too Many Attempts', 'Try again later or reset your password.');
                            break;
                        case 'auth/network-request-failed':
                            Alert.alert('Network Error', 'Please check your internet connection.');
                            break;
                        case 'auth/invalid-credential':
                            Alert.alert('Invalid credentials provided', 'Check email/password and try again.');
                            break;
                        default:
                            Alert.alert('Login Error', 'An unexpected error occurred. Please try again.');
                    }
                    setEmailError(true);
                    setSaving(false);
                });
        };


        return (
            <Modal animationType='fade' transparent={true} visible={showLogin} onBackdropPress={() => (setShowLogin(false))} onRequestClose={() => (setShowLogin(false))}>
                <TouchableOpacity
                    style={loginStyle.container}
                    activeOpacity={1}
                    onPressOut={() => {
                        setShowLogin(false)
                        setModalUser(null)
                    }}>
                    <TouchableWithoutFeedback >
                        <View style={loginStyle.formContainer}>
                            <View style={loginStyle.card}>
                                {
                                    saving
                                        ? <View style={loginStyle.subCard}>
                                            <ActivityIndicator size="large" color="green" />
                                            <Text style={loginStyle.title}>Signing in ...</Text>
                                        </View>
                                        :
                                        <>
                                            <Text style={loginStyle.title}>MALIGAYANG PAGDATING</Text>
                                            {
                                                modalUser
                                                    ? <>
                                                        <Image
                                                            source={{ uri: modalUser.photoURL }}
                                                            style={{ ...styles.btnImage, borderRadius: 50 }}
                                                        />
                                                        <Text>
                                                            {modalUser.displayName}
                                                        </Text>
                                                        <Text>
                                                            {modalUser.brgy + ", " + modalUser.mun}
                                                        </Text>

                                                        <TouchableOpacity disabled={emailError} style={{ ...loginStyle.button }} onPress={() => setShowLogin(false)} >
                                                            <Text style={loginStyle.buttonText}>Close</Text>
                                                        </TouchableOpacity>
                                                    </>
                                                    : <>
                                                        <Text style={loginStyle.subtitle}>Mag Login sa iyong account</Text>
                                                        <View style={loginStyle.inputContainer}>
                                                            <Text>Email:</Text>
                                                            <TextInput
                                                                style={{ ...loginStyle.input, borderColor: emailError ? 'red' : '#ddd' }}
                                                                value={email}
                                                                onChangeText={handleEmail}
                                                                placeholder="Enter your Email"
                                                                placeholderTextColor="#999"
                                                                autoCapitalize="none"
                                                            />
                                                        </View>
                                                        <View style={loginStyle.inputContainer}>
                                                            <Text>Password:</Text>
                                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                <TextInput
                                                                    style={[loginStyle.input, { flex: 1 }]} // Adjust input width to accommodate the icon
                                                                    value={password}
                                                                    onChangeText={text => setPassword(text)}
                                                                    placeholder="Enter your password"
                                                                    placeholderTextColor="#999"
                                                                    autoCapitalize="none"
                                                                    secureTextEntry={!isPasswordVisible} // Control visibility
                                                                />
                                                                <TouchableOpacity onPress={togglePasswordVisibility} style={{ marginLeft: 10 }}>
                                                                    <Ionicons
                                                                        name={isPasswordVisible ? 'eye-outline' : 'eye-off-outline'}
                                                                        size={24}
                                                                        color="#999"
                                                                    />
                                                                </TouchableOpacity>
                                                            </View>
                                                        </View>

                                                        <TouchableOpacity disabled={emailError} style={{ ...loginStyle.button, backgroundColor: emailError ? '#A1A1A1' : 'green' }} onPress={handleLogin} >
                                                            <Text style={loginStyle.buttonText}>Sign In</Text>
                                                        </TouchableOpacity>

                                                        <TouchableOpacity style={loginStyle.createAccountButton}>
                                                            {
                                                                users && <Text style={loginStyle.createAccountButtonText} onPress={() => {
                                                                    setShowLogin(false)
                                                                    navigation.navigate('Register', { users: users })
                                                                }}>
                                                                    Create Account?</Text>
                                                            }
                                                        </TouchableOpacity>
                                                    </>
                                            }
                                        </>
                                }
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </TouchableOpacity>
            </Modal>
        )
    }

    const drawerLockMode = logUser ? 'unlocked' : 'locked-closed';

    const drawerView = () => (
        <>
            {
                user
                    ?
                    <View style={styles.drawerContainer}>
                        <View style={styles.drawerSubcontainer}>
                            {
                                logUser?.photoURL ? (
                                    <Image
                                        source={{ uri: logUser.photoURL }}
                                        style={{ ...styles.drawerImg, }}
                                    />
                                ) : (
                                    <Image
                                        source={logonLogo}
                                        style={styles.drawerImg}
                                    />
                                )
                            }
                            <Text style={styles.drawerTitle}>{logUser?.displayName}</Text>
                        </View>
                        <View style={styles.drawerViewText}>
                            <Image source={require('../assets/user.png')} style={styles.drawerBtnText} />
                            <Text
                                style={styles.drawerBtnText}
                                onPress={() => {
                                    navigation.navigate('Extensionist', { logUser: logUser });
                                }}>
                                My Profile
                            </Text>
                        </View>
                        <Divider />
                        <View style={styles.drawerLogoutContainer} >
                            <Image source={require('../assets/logout.png')} style={styles.drawerBtnText} />
                            <Text
                                onPress={handleLogout}
                                style={styles.drawerLogoutBtn}
                            >
                                Logout
                            </Text>

                        </View>
                    </View>
                    :
                    <></>
            }

        </>
    )

    return (
        <>
            <DrawerLayoutAndroid
                //drawerBackgroundColor="rgba(0,0,0,0.6)"
                ref={drawer}
                drawerWidth={300}
                drawerPosition={drawerPosition}
                renderNavigationView={() => drawerView()}
                drawerLockMode={drawerLockMode}
            >
                <View style={styles.bgOut}>
                    <View style={styles.logoBg} >
                        <Text style={styles.appTitle} >Queen Pineapple Farming</Text>
                    </View>
                    <View style={styles.btnBg}>
                        <Image source={appLogo} style={styles.appLogo} />
                        <View style={styles.btnContainer}>
                            <View style={styles.btnRow}>
                                <TouchableHighlight underlayColor={'#F5C115'} style={styles.btnbtn} onPress={() =>
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
                                <TouchableHighlight underlayColor={'#F5C115'} style={styles.btnbtn} onPress={() =>
                                    user
                                        ?
                                        navigation.navigate('Yield', { farms: farms })
                                        :
                                        setShowLogin(true)
                                }>
                                    <View style={styles.btnbtnChild}>
                                        <Image source={yieldLogo} style={styles.btnImage} />
                                        <Text style={styles.buttonText}>Dami ng Ani</Text>
                                    </View>
                                </TouchableHighlight>
                            </View>
                            <View style={styles.btnRow}>
                                <TouchableHighlight underlayColor={'#F5C115'} style={styles.btnbtn} onPress={() => {
                                    navigation.navigate('Gallery', { farms: farms, user: logUser })
                                }}>
                                    <View style={styles.btnbtnChild}>
                                        <Image source={galleryLogo} style={styles.btnImage} />
                                        <Text style={styles.buttonText}>Mga Bukid ng Pinya</Text>
                                    </View>
                                </TouchableHighlight>
                                <TouchableHighlight underlayColor={'#F5C115'} style={styles.btnbtn} onPress={() =>
                                    navigation.navigate('Video')}>
                                    <View style={styles.btnbtnChild}>
                                        <Image source={videoLogo} style={styles.btnImage} />
                                        <Text style={styles.buttonText}>Mga Bidyo</Text>
                                    </View>
                                </TouchableHighlight>
                            </View>
                            <View style={styles.btnRow}>
                                <TouchableHighlight underlayColor={'#F5C115'} style={styles.btnbtn} onPress={() => navigation.navigate('About')}>
                                    <View style={styles.btnbtnChild}>
                                        <Image source={aboutLogo} style={styles.btnImage} />
                                        <Text style={styles.buttonText}>Tungkol</Text>
                                    </View>
                                </TouchableHighlight>
                                {
                                    user
                                        ?
                                        <TouchableHighlight
                                            style={styles.btnbtn}
                                        //onPress={handleLogout}
                                        >
                                            <View style={styles.btnbtnChild2}>
                                                {
                                                    logUser?.photoURL ? (
                                                        <Image
                                                            source={{ uri: logUser.photoURL }}
                                                            style={{ ...styles.btnImage, borderRadius: 50 }}
                                                        />
                                                    ) : (
                                                        <Image
                                                            source={logonLogo}
                                                            style={styles.btnImage}
                                                        />
                                                    )}
                                                <Text style={{ ...styles.buttonText, color: '#fff' }}>Log out</Text>
                                            </View>
                                        </TouchableHighlight>
                                        :
                                        <TouchableHighlight underlayColor={'#F5C115'} style={styles.btnbtn} onPress={() => setShowLogin(true)}>
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
            </DrawerLayoutAndroid>
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
        top: -64,
        resizeMode: 'contain'
    },
    appTitle: {
        fontSize: windowWidth * 0.1,
        color: '#fff',
        fontWeight: '600',
        textAlign: 'center',
        fontFamily: 'serif',
        padding: 5
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
        gap: 12,
        marginBottom: 10,
    },
    btnbtn: {
        flex: 1,
        borderRadius: 12,
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
        height: 64,
        resizeMode: 'contain'
    },
    buttonText: {
        fontSize: windowWidth * 0.04,
        textAlign: 'center',
        fontFamily: 'serif',
        fontStyle: 'italic',
    },
    drawerContainer: {
        // padding: 20,
        // marginTop: '10%',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        // alignItems: 'center',
        // backgroundColor: 'transparent'

    },
    drawerSubcontainer: {
        backgroundColor: '#22b14c',
        padding: 20,
        height: '30%'
    },
    drawerViewText: {
        backgroundColor: '#fff',
        padding: 20,
        height: '60%',
        flexDirection: 'row',

    },
    drawerImg: {
        borderRadius: 100,
        width: 130,
        height: 130,
        marginTop: 50
    },
    drawerTitle: {
        // fontSize: windowWidth * 0.1,
        fontSize: 30,
        color: '#fff',
        fontWeight: '300',
        // textAlign: 'center',
        fontFamily: 'serif',
        // marginLeft:5,
        marginTop: 10

    },
    drawerBtnText: {
        color: '#000',
        marginLeft: 30,
        marginTop: 5,
        fontFamily: 'serif',
        fontSize: 15
    },
    drawerLogoutContainer: {
        flexDirection: 'row',
        padding: 20

    },
    drawerLogoutBtn: {
        color: '#000',
        marginLeft: 30,
        marginTop: 5,
        fontFamily: 'serif',
        fontSize: 20
    },

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
        // backgroundColor: 'red',
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
        marginBottom: 32,
    },
    card: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        padding: 20,
        marginBottom: 20,
    },
    subCard: {
        display: 'flex',
        flexDirection: 'row',
        padding: 8 ,
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    inputContainer: {
        marginBottom: 20
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
        justifyContent: 'center',
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



