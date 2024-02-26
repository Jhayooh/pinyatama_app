import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Button, Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const Register = ({ visible, onClose }) => {
    const [avatar, setAvatar] = useState(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [baranggay, setBaranggay] = useState('');
    const [city, setCity] = useState('');
    const [province, setProvince] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.cancelled) {
            setAvatar(result.uri);
        }
    };

    const handleRegister = () => {
        // Handle registration logic here
        console.log("Avatar:", avatar);
        console.log("First Name:", firstName);
        console.log("Last Name:", lastName);
        console.log("Baranggay:", baranggay);
        console.log("City:", city);
        console.log("Province:", province);
        console.log("Email:", email);
        console.log("Password:", password);
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={() => onClose()}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <View>
                        <Text style={{ color: 'black', textAlign: 'center', marginBottom: 5, fontSize: 20, fontWeight: 'bold' }}>MALIGAYANG PAGDATING</Text>
                        <Text style={{ color: '#E3E55A', textAlign: 'center', marginBottom: 10, }}>I- register ang iyong account</Text>
                    </View>
                    <View style={styles.avatarContainer}>
                        <TouchableOpacity onPress={pickImage}>
                            {avatar ? <Image source={{ uri: avatar }} style={styles.avatar} /> : <Text>Upload Profile</Text>}
                        </TouchableOpacity>
                    </View>


                    <View >
                        <TextInput
                            style={styles.input}
                            placeholder="First Name"
                            value={firstName}
                            onChangeText={text => setFirstName(text)}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Last Name"
                            value={lastName}
                            onChangeText={text => setLastName(text)}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Baranggay"
                            value={baranggay}
                            onChangeText={text => setBaranggay(text)}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="City"
                            value={city}
                            onChangeText={text => setCity(text)}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Province"
                            value={province}
                            onChangeText={text => setProvince(text)}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            value={email}
                            onChangeText={text => setEmail(text)}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            value={password}
                            onChangeText={text => setPassword(text)}
                            secureTextEntry
                        />
                    </View>

                    <Button title="Register" onPress={handleRegister} />
                </View>
            </View>
        </Modal >
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#247027',
        width: '80%',
        height: '70%',
        borderRadius: 10,
        elevation: 5,
        padding: 20,
    },
    avatarContainer: {
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor:'#fff',
        width:100,
        height:100,
        borderRadius:100,
        justifyContent:'center',
        alignContent:'center'
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    input: {
        textAlign: 'center',
        width: '100%',
        height: '10%',
        backgroundColor: 'white',
        marginBottom: 5,
        borderRadius: 14,
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 10,
        fontSize: 12,
        // height: 40,
        // borderColor: 'gray',
        // borderWidth: 1,
        // marginBottom: 10,
        // paddingHorizontal: 10,
        // backgroundColor: 'white'
    },
    bottomButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20
    },
});

export default Register;
