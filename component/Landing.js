import { signOut } from "firebase/auth";
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import {
    Dimensions,
    Image,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
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
                        <Image source={require('../assets/calcu.png')} style={{width:'50%', height:'50%'}}/>
                        <Text style={styles.buttonText}>Kalkulador ng gastos</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => null}>
                        <Image source={require('../assets/yield.png')} style={{width:'70%', height:'60%'}}/>
                        <Text style={styles.buttonText}>Tagapagukit ng ani</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.row}>
                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Gallery')}>
                        <Image source={require('../assets/gallery.png')}style={{width:'40%', height:'50%'}} />
                        <Text style={styles.buttonText}>Mga bukid ng pinya</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Video')}>
                        <Image source={require('../assets/video.png')} style={{width:'60%', height:'60%'}}/>
                        <Text style={styles.buttonText}>Mga pinya</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.row}>
                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Tungkol')}>
                        <Image source={require('../assets/about.png')}  style={{width:'60%', height:'60%'}}/>
                        <Text style={styles.buttonText}>Tungkol</Text>
                    </TouchableOpacity>
                    {
                        user
                            ?
                            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Register')}>
                                <Image source={require('../assets/profile.png')} style={{width:'70%', height:'60%'}}/>
                                <Text style={styles.buttonText}>Logout</Text>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity style={styles.button} onPress={() => setShowModal(true)}>
                                <Image source={require('../assets/profile.png')} style={{width:'70%', height:'60%'}}/>
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
                    <Image source={require('../assets/pinya.png')} style={styles.logo}/>
                    <Text style={styles.text}>Queen Pineapple Farming</Text>
                    <ButtonContainer navigation={navigation} />
                    {/* <Image source={require('../assets/eclipse.png')} style={styles.overlayOval} />
                        <Image source={require('../assets/pinya.png')} style={styles.overlayLogo} /> */}

                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        aspectRatio: 1,
        borderBottomLeftRadius: wp('30%'), 
        borderBottomRightRadius: wp('30%'),
        justifyContent: 'flex-start',
        alignItems:'center',
        flexDirection:'column',
        backgroundColor: '#17AF41',
    },
    logo: {
        width: wp('20%'), 
        height: wp('20%'), 
        marginTop: hp('5%'), 
    },
    text:{
        color:'white',
        fontFamily:'serif',
        textAlign:'center',
        fontSize: wp('10%'), 
       
        marginTop: hp('5%'),
    },
    row: {
        flexDirection: 'row',
            justifyContent: 'space-around',
            gap: 30
        },
    buttonContainer: {
        marginTop:50,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        zIndex: 2,
        paddingTop: hp('30%'), 
        elevation:50,
    },
    button: {
        marginBottom: wp('2%'), 
        width: wp('40%'), 
        height: hp('20%'), 
        padding: wp('2%'), 
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: wp('3%'), 
        },
        shadowOpacity: 0.37,
        shadowRadius: wp('5%'), 
        backgroundColor: 'white',
        borderRadius: wp('5%'), 
        borderWidth: wp('1%'), 
        borderColor: '#206830',
        overflow: 'hidden',
    },
     buttonText: {
        color: '#206830',
        textAlign: 'center',
        fontSize: 18,
        fontFamily: 'serif',
         fontStyle:'italic',
        
    },
});

    // container: {
    //     aspectRatio: 1,
    //     borderBottomLeftRadius: 150,
    //     justifyContent: 'flex-start',
    //     alignItems:'center',
    //     flexDirection:'column',
    //     backgroundColor: '#17AF41',
        

    // },
    // logo: {
    //     width: 50,
    //     height: 50,
    //     marginTop: 30
    // },
    // text:{
    //     color:'white',
    //     fontFamily:'serif',
    //     fontSize:50,
    //     fontStyle:'italic',
    //     marginTop: 20
    // },
    // buttonContainer: {
    //     flex: 1,
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     position: 'absolute',
    //     zIndex: 2,
    //     paddingTop: 300,
    //     elevation:50,
       
    // },
    // row: {
    //     flexDirection: 'row',
    //     justifyContent: 'space-around',
    //     gap: 30
    // },
    // buttonText: {
    //     color: 'black',
    //     textAlign: 'center',
    //     fontSize: 18,
    //     fontFamily: 'serif',
        
    // },
    // button: {
    //     marginBottom: 10,
    //     width: 150,
    //     height: 180,
    //     padding: 5,
    //     alignItems: 'center',
    //     justifyContent: 'center',
    //     shadowColor: '#000',
    //     shadowOffset: {
    //         width: 0,
    //         height: 6,
    //     },
    //     shadowOpacity: 0.37,
    //     shadowRadius: 7.49,
    //     backgroundColor: 'white',
    //     borderRadius: 20,
    //     borderWidth: 3,
    //     borderColor: '#206830',
    //     overflow: 'hidden',
    // },
    // gradient: {
    //     width: '100%',
    //     height: '100%',
    //     alignItems: 'center',
    //     justifyContent: 'center',
    // },
    // overlayImage: {
    //     position: 'absolute',
    //     resizeMode: 'cover',
    //     opacity: 1.0,
    //     zIndex: 1,
    //     borderRadius: 20,
    //     top: '10%',
    //     left: '3%',
    //     width: 400,
    //     height: 780
    // },
    // overlayOval: {
    //     position: 'absolute',
    //     top: '35%',
    //     left: '50%',
    //     width: windowWidth * 0.455,
    //     height: windowHeight * 0.225,
    //     marginLeft: -((windowWidth * 0.455) / 2),
    //     marginTop: -((windowHeight * 0.215) / 2),
    //     opacity: 1.0,
    //     zIndex: 3,
    //     shadowOpacity: 10.0,
    //     shadowRadius: 10.0,


    // },
    // overlayLogo: {
    //     position: 'absolute',
    //     top: '35%',
    //     left: '50%',
    //     width: windowWidth * 0.45,
    //     height: windowHeight * 0.15,
    //     marginLeft: -((windowWidth * 0.45) / 2),
    //     marginTop: -((windowHeight * 0.15) / 2),
    //     opacity: 1.0,
    //     zIndex: 4,
    //     shadowOpacity: 0.37,
    //     shadowRadius: 7.49,

    // },



