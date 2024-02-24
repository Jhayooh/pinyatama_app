import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth } from '../firebase/Config';

const Login = ({ showModal, setShowModal }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

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
                <KeyboardAvoidingView
                    behavior="padding"
                >
                    <View>
                    <Text style={{color:'black', textAlign:'center',  marginBottom: 5,fontSize: 20, fontWeight:'bold'}}>MALIGAYANG PAGDATING</Text>
                    <Text style={{color:'#E3E55A',textAlign:'center',  marginBottom: 10,}}>Mag login sa iyong account</Text>
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
                        <TouchableOpacity
                            onPress={handleSignUp}
                        >
                            <Text >Register</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setShowModal(!showModal)}
                        >
                            <Text >Close</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
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
        textAlignVertical:'center',
        fontSize: 16

    },
    bottomButton: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        gap: 12,
    },

});


export default Login