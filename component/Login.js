import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native-elements';

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/Config';

const Login = ({ }) => {

    const [user] = useAuthState(auth)

    return (

        <View style={styles.modalContainer}>
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

    )
}
const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '247027',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    button: {
        backgroundColor: 'blue',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginBottom: 10,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
    },
    closeButton: {
        color: 'white',
        textAlign: 'center',
    },
    placeholder:{
        color: '#716B6B'
    }

});
export default Login