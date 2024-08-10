import React, { useState, useEffect } from "react";
import {
    Text,
    View,
    TextInput,
    StyleSheet,
    Image,
    ScrollView,
    Modal,
    TouchableOpacity
} from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { updateDoc, doc } from 'firebase/firestore';

//icon
import edit from '../assets/edit-text.png';
import { Button } from "native-base";

export const EditProfile = ({ navigation, route }) => {
    const { logUser } = route.params;
    logUser && console.log("loguserrrrrr", logUser)
    const [showAddImage, setShowAddImage] = useState(false);
    //user details
    const [photoURL, setphotoURL] = useState(null);
    const [displayName, setDisplayName] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [phoneNumber, setphoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        if (!logUser) return
        const lu = logUser
        setphotoURL(lu.photoURL || null)
        setDisplayName(lu.displayName)
        setFirstname(lu.firstname)
        setLastname(lu.lastname)
        setphoneNumber(lu.phoneNumber)
        setEmail(lu.email)
    }, [logUser])

    const validatePasswords = () => {
        if (password !== password) {
            Alert.alert('Error', 'Password is not correct');
            return false;
        }
        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'New password and confirm password do not match.');
            return false;
        }
        if (newPassword.length < 6) {
            Alert.alert('Error', 'New password must be at least 6 characters long.');
            return false;
        }
        return true;
    };


    const saveProfile = async () => {
        if (password && validatePasswords()) {
            try {
                const userDocRef = doc(db, 'users', logUser.id);
                await updateDoc(userDocRef, {
                    photoURL: photoURL,
                    displayName: displayName,
                    firstname: firstname,
                    lastname: lastname,
                    phoneNumber: phoneNumber,
                    email: email,
                    password: newPassword,
                });
                Alert.alert('Success', 'Profile updated successfully!');
                navigation.goBack();
            } catch (e) {
                console.log(e);
                Alert.alert('Error', 'Failed to update profile.');
            }
        } else if (!password) {
            Alert.alert('Error', 'Please enter your current password.');
        }
    };


    const openGallery = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                quality: .6,
            });

            if (!result.canceled) {
                setphotoURL(result.assets[0].uri);
            }
        } catch (e) {
            console.log(e);
        }
    }

    const openCamera = async () => {
        try {
            await ImagePicker.requestCameraPermissionsAsync();
            let result = await ImagePicker.launchCameraAsync({
                cameraType: ImagePicker.CameraType.back,
                quality: .6
            })

            if (!result.canceled) {
                setphotoURL(result.assets[0].uri);
            }
        } catch (e) {
            console.log(e);
        }
    }

    React.useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={saveProfile}>
                    <View style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row', gap: 1 }}>
                        <Text style={{ color: 'white', fontSize: 20 }}>Save</Text>
                    </View>
                </TouchableOpacity>
            )
        });
    }, [navigation, photoURL, displayName, firstname, lastname, phoneNumber, email, newPassword]);

    return (
        <>
            <ScrollView>
                {
                    logUser &&
                    <View >
                        <View style={styles.imgContainer}>
                            <TouchableOpacity style={styles.editIcon} onPress={() => setShowAddImage(true)}>
                                <Image source={edit} />
                            </TouchableOpacity>

                            <Image source={photoURL ? { uri: photoURL } : require('../assets/p.jpg')} style={styles.img} />
                            <Text style={styles.header}>Profile Photo</Text>
                        </View>
                        <View style={styles.container}>
                            {/* <Text> Personal Information</Text> */}
                            {/* <View style={styles.subContainer}>
                                <Text style={styles.title}>Municipality</Text>
                                <TextInput
                                    editable={false}
                                    value={logUser?.logUser.mun}
                                    style={styles.disabledInput}
                                    placeholder="Municipality"
                                />
                            </View>
                            <View style={styles.subContainer}>
                                <Text style={styles.title}>Barangay</Text>
                                <TextInput
                                    editable={false}
                                    value={logUser?.logUser.brgy}
                                    style={styles.disabledInput}
                                    placeholder="Barangay"
                                />
                            </View> */}
                            <Text style={styles.title}>Display Name</Text>
                            <TextInput
                                value={displayName}
                                onChangeText={setDisplayName}
                                style={styles.textInput}
                                placeholder="Display Name"
                            />
                            <View style={styles.subContainer}>
                                <Text style={styles.title}>Firstname</Text>
                                <TextInput
                                    value={firstname}
                                    onChangeText={setFirstname}
                                    style={styles.textInput}
                                    placeholder="Firstname"
                                />
                            </View>
                            <View style={styles.subContainer}>
                                <Text style={styles.title}>Lastname</Text>
                                <TextInput
                                    value={lastname}
                                    onChangeText={setLastname}
                                    style={styles.textInput}
                                    placeholder="Lastname"
                                />
                            </View>
                            <View style={styles.subContainer}>
                                <Text style={styles.title}>Phone Number</Text>
                                <TextInput
                                    value={phoneNumber}
                                    onChangeText={setphoneNumber}
                                    style={styles.textInput}
                                    placeholder="Phone Number"
                                />
                            </View>
                            <View style={styles.subContainer}>
                                <Text style={styles.title}>Email</Text>
                                <TextInput
                                    value={email}
                                    onChangeText={setEmail}
                                    style={styles.textInput}
                                    placeholder="Email"
                                />
                            </View>
                            <View style={styles.subContainer}>
                                <Text style={styles.title}>Current Password</Text>
                                <TextInput
                                    value={password}
                                    onChangeText={setPassword}
                                    style={styles.textInput}
                                    placeholder="Password"
                                    secureTextEntry
                                />
                            </View>
                            <View style={styles.subContainer}>
                                <Text style={styles.title}>New Password</Text>
                                <TextInput
                                    value={newPassword}
                                    onChangeText={setNewPassword}
                                    style={styles.textInput}
                                    placeholder="New Password"
                                    secureTextEntry
                                />
                            </View>
                            <View style={styles.subContainer}>
                                <Text style={styles.title}>Confirm Password</Text>
                                <TextInput
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    style={styles.textInput}
                                    placeholder="Confirm Password"
                                    secureTextEntry
                                />
                            </View>
                            <TouchableOpacity style={styles.btn}>
                                <Text style={styles.btnText}>Delete Account</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                }
            </ScrollView>
            <Modal animationType='fade' visible={showAddImage} transparent={true}>
                <View style={styles.addImage}>
                    <View style={styles.modalContainer}>
                        <TouchableOpacity style={styles.cam} onPress={openGallery}>
                            <Image source={require('../assets/gallery.png')} style={{ width: 42, height: 42 }} />
                            <Text>Gallery</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cam} onPress={openCamera}>
                            <Image source={require('../assets/upload.png')} style={{ width: 42, height: 42 }} />
                            <Text>Camera</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cam} onPress={() => setShowAddImage(false)}>
                            <Image source={require('../assets/close.png')} style={{ width: 42, height: 42 }} />
                            <Text>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 30,
        backgroundColor: '#fafafa',
        height: '100%',
    },
    subContainer: {
        flexDirection: 'column',
    },
    imgContainer: {
        backgroundColor: '#F0F0F0',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    editIcon: {
        alignSelf: 'flex-end',
    },
    img: {
        borderRadius: 100,
        width: 200,
        height: 200,
    },
    header: {
        fontFamily: 'serif',
        fontSize: 25,
        fontWeight: 'bold',
        marginTop: 2,
        textTransform: 'uppercase',
    },
    title: {
        color: '#070707',
        fontSize: 12,
        fontWeight: '500',
        margin: 5,
        textTransform: 'uppercase',
    },
    textInput: {
        height: 40,
        backgroundColor: '#FBFBFB',
        paddingHorizontal: 18,
        color: '#3C3C3B',
        fontSize: 16,
        borderBottomColor: '#C8C8C8',
        borderBottomWidth: 2,
    },
    disabledInput: {
        height: 40,
        backgroundColor: '#EFEFEF', // Changed to a slightly different color
        paddingHorizontal: 18,
        color: '#A8A8A8', // Use gray color for text to indicate it's disabled
        fontSize: 16,
        borderBottomColor: '#C8C8C8',
        borderBottomWidth: 2,
    },
    addImage: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF',
        flexDirection: 'row',
        gap: 32,
        padding: 32,
        borderRadius: 8,
    },
    btn:{
        marginTop:20,
        backgroundColor:'red',
        padding:20
    },
    btnText:{
        color:'#fff',
        alignSelf:'center',
        textTransform: 'uppercase',
        fontSize:15,
        fontWeight:'bold',
        fontFamily:'serif'
    }
});
