import React, { useState, useEffect} from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View,KeyboardAvoidingView } from 'react-native';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useAuthState } from 'react-firebase-hooks/auth';
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
                    <TextInput
                        placeholder="Email"
                        value={email}
                        onChangeText={text => setEmail(text)}
                    />
                    <TextInput
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
                    <TouchableOpacity
                        onPress={handleSignUp}
                    >
                        <Text>Register</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setShowModal(!showModal)}
                    >
                        <Text>close</Text>
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
        justifyContent :'center', 
        alignItems:'center', 
    },
    modalContent:{
        backgroundColor: 'white',
        width: 280,
        padding: 20,
        borderRadius: 10,
        elevation: 5, 

    },


      modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
      },
      modalLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 9,
      },

});


export default Login