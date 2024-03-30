import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth } from '../firebase/Config';
import Register from "./Register";

export default Login = ({ showModal, setShowModal }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showRegisterModal, setShowRegisterModal] = useState(false);
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

    return (
        <View style={styles.container}>
            <View style={styles.formContainer}>
                <View style={styles.card}>
                    <Text style={styles.title}>MALIGAYANG PAGDATING</Text>
                    <Text style={styles.subtitle}>Mag Login sa iyong account</Text>
                    <View style={styles.inputContainer}>

                        <TextInput
                            style={styles.input}
                            value={email}
                            onChangeText={text => setEmail(text)}
                            placeholder="Email"
                            placeholderTextColor="#999"
                        />
                    </View>
                    <View style={styles.inputContainer}>

                        <TextInput
                            style={styles.input}
                            value={password}
                            onChangeText={text => setPassword(text)}
                            placeholder="Password"
                            placeholderTextColor="#999"
                            secureTextEntry
                        />
                    </View>
                    {/* <TouchableOpacity style={styles.forgotPasswordButton}>
                        <Text style={styles.forgotPasswordButtonText}>Forgot?</Text>
                    </TouchableOpacity> */}

                    <TouchableOpacity style={styles.button} onPress={handleLogin} >
                        <Text style={styles.buttonText}>Sign In</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.createAccountButton}>
                        <Text style={styles.createAccountButtonText} onPress={() => setShowRegisterModal(true)}>
                            Create Account?</Text>
                        <Register
                        visible={showRegisterModal}
                        onClose={() => setShowRegisterModal(false)}
                    />
                    </TouchableOpacity>
                    {/* <View style={styles.bottomButton}>
                        <TouchableOpacity style={styles.bottomButtonItem} onPress={() => setShowRegisterModal(true)}>
                            <Text style={styles.btnText}>Register</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.bottomButtonItem} onPress={() => setShowModal(!showModal)}>
                            <Text style={styles.btnText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                    <Register
                        visible={showRegisterModal}
                        onClose={() => setShowRegisterModal(false)}
                    /> */}
                </View>
            </View>
        </View>
    );
};

const styles = {
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
    // forgotPasswordButton: {
    //     width: '100%',
    //     textAlign: 'flex-end',
    // },
    // forgotPasswordButtonText: {
    //     color: '#20B2AA',
    //     fontSize: 12,
    //     fontWeight: 'bold',
    //     textAlign: 'right'
    // },
    createAccountButton: {
        marginTop: 10,
        textAlign:'center'
        
    },
    createAccountButtonText: {
        color: 'green',
        fontSize: 15,
        fontWeight: 'bold',
        justifyContent:'center'
        
        
    },
    // btnText: {
    //     color: 'white',
    //     fontSize: 12,
    //     fontWeight: 'bold',
    //     fontFamily: 'serif'

    // },
    // bottomButton: {
    //     flexDirection: 'row',
    //     justifyContent: 'space-around',
    //     gap: 12,
    // },
    // bottomButtonItem: {
    //     flex: 1,
    //     padding: 12,
    //     alignItems: 'center',
    //     paddingHorizontal: 24,
    //     paddingVertical: 16,
    //     textAlign: 'center',
    //     shadowOpacity: 0.37,
    //     shadowRadius: 7.49,
    //     elevation: 20,
    //     backgroundColor: '#17AF41',
    //     borderRadius: 20,
    //     borderWidth: 1,
    //     borderColor: '#206830',
    // },

};


