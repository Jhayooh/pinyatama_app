import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth } from '../firebase/Config';
import Register from './Register';

const Login = ({ showModal, setShowModal }) => {
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
        <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
                <View
                >
                    <View>
                        <Text style={{ color: 'black', textAlign: 'center', marginBottom: 5, fontSize: 20, fontWeight: 'bold' }}>MALIGAYANG PAGDATING</Text>
                        <Text style={{ color: '#E3E55A', textAlign: 'center', marginBottom: 10, }}>Mag login sa iyong account</Text>
                    </View>
                    <View >
                        <TextInput style={styles.modalLabel}
                            placeholder="Email"
                            value={email}
                            onChangeText={text => setEmail(text)}
                        />
                        <TextInput style={styles.modalLabel}
                            placeholder="Password"
                            value={password}
                            onChangeText={text => setPassword(text)}
                            secureTextEntry
                        />
                    </View>
                    <View>
                        <TouchableOpacity
                            onPress={handleLogin}
                        >
                            <Text style={styles.buttonText}>Login</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.bottomButton}>
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
                    />
                </View>
            </View>
        </View>

    )
}
const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#247027',
        width: 280,
        padding: 20,
        borderRadius: 10,
        elevation: 5,
    },
    modalLabel: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        backgroundColor: 'white'
    },
    buttonText: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        backgroundColor: '#E3E55A',
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: 16,

    },
    btnText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
        fontFamily: 'serif'

    },
    bottomButton: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        gap: 12,
    },
    bottomButtonItem: {
        flex: 1,
        padding: 12,
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 16,
        textAlign: 'center',
        shadowOpacity: 0.37,
        shadowRadius: 7.49,
        elevation: 20,
        backgroundColor: '#17AF41',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#206830',
    },

});


export default Login