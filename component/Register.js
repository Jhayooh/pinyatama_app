
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Image, Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth } from '../firebase/Config';

export default Register = ({ visible, onClose, showModal, setShowModal }) => {
    const [avatar, setAvatar] = useState(null);
    const [images, setImages] = useState({})
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [baranggay, setBaranggay] = useState('');
    const [city, setCity] = useState('');
    const [province, setProvince] = useState('');
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showAddImage, setShowAddImage] = useState(false)

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

    const openGallery = async () => {
        try {

            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                quality: .6,
            });

            if (!result.canceled) {
                addImage(result.assets[0].uri, result.assets[0].height, result.assets[0].width)
            }
        } catch (e) {
            console.log(e);
        }
    }
    const handleMapPress = (e) => {
        setUserLocation(e.nativeEvent.coordinate);
    };
    const openCamera = async () => {
        try {
            await ImagePicker.requestCameraPermissionsAsync();
            let result = await ImagePicker.launchCameraAsync({
                cameraType: ImagePicker.CameraType.back,
                quality: .6
            })

            if (!result.canceled) {
                addImage(result.assets[0].uri, result.assets[0].height, result.assets[0].width)
            }
        } catch (e) {
            console.log(e);
        }
    }
    const addImage = (image, height, width) => {
        setImages({ url: image, height: height, width: width })
    }
    console.log("image added", images);

    const uploadImages = async (uri, fileType) => {
        try {
            const response = await fetch(uri);
            const blob = await response.blob();
            const filename = uri.substring(uri.lastIndexOf('/') + 1);

            const storageRef = ref(storage, `FarmImages/${user.uid}/${filename}`);
            const uploadTask = uploadBytesResumable(storageRef, blob);

            uploadTask.on('state_changed',
                (snapshot) => {
                    // Handle progress
                },
                (error) => {
                    console.error("Error uploading image: ", error);
                },
                () => {
                    // Upload completed successfully, get download URL
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        console.log('File available at', downloadURL);
                        setUploadedImg((uImg) => [...uImg, { url: downloadURL, uid: user.uid }]);
                    }).catch((error) => {
                        console.error("Error getting download URL: ", error);
                    });
                }
            );
        } catch (error) {
            console.error("Error uploading image: ", error);
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
            <View style={styles.container}>
                <View style={styles.formContainer}>
                    <View style={styles.card}>

                    <View style={{ marginBottom: 8, width: 180, height: 180, borderRadius: 90, overflow: 'hidden', backgroundColor: '#101010', alignItems:'center' }}>      
                            {
                                images &&
                                <Image source={{ uri: images.url }} style={{ height: '100%', width: 240, borderRadius: 6 }} />
                            }
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity style={styles.touch} onPress={() => {
                                setShowAddImage(true)
                            }}>
                                <Text style={styles.text}>Set Profile</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.inputContainer}>

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
                        <TouchableOpacity style={styles.button}>
                            <Text style={styles.buttonText}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <Modal animationType='fade' visible={showAddImage} transparent={true}>
                    <View style={styles.addImage}>
                        <TouchableOpacity style={styles.touch} onPress={() => {
                            openGallery()
                        }}>
                            <Text style={styles.text}>Gallery</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.touch} onPress={() => {
                            openCamera()
                        }}>
                            <Text style={styles.text}>Camera</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.touch} onPress={() => {
                            setShowAddImage(!showAddImage)
                        }}>
                            <Text style={styles.text}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
            </View>
        </Modal>
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
        marginBottom:10,
        
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
};
