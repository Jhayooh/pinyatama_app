import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth } from '../firebase/Config';

const Register = ({ visible, onClose, showModal, setShowModal }) => {
    const [avatar, setAvatar] = useState(null);
    const [images, setImages] = useState([])
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
        setImages(images => [...images, { url: image, height: height, width: width }])
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
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <View style={{ marginBottom: 8, width: '100%', height: 180, borderRadius: 6, padding: 4, backgroundColor: '#101010' }}>
                        {
                            images &&
                            <FlatList
                                data={images}
                                // numColumns={3}
                                horizontal={true}
                                renderItem={({ item }) => (
                                    <View style={{ flex: 1 }}>
                                        <Image style={{ height: '100%', width: 240, borderRadius: 100 }} source={{ uri: item.url }} />
                                    </View>
                                )}
                                ItemSeparatorComponent={() =>
                                    <View style={{ width: 4, height: '100%' }}></View>
                                }
                            // columnWrapperStyle={{
                            //   gap: 2,
                            //   marginBottom: 2
                            // }}
                            />
                        }
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity style={styles.touch} onPress={() => {
                            setShowAddImage(true)
                        }}>
                            <Text style={styles.text}>Add Image</Text>
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
                    <View style={styles.bottomButton}>
                        <TouchableOpacity style={styles.bottomButtonItem} onPress={handleRegister} >
                            <Text style={styles.btnText}>Register</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.bottomButtonItem} onPress={() => setShowModal(!showModal)}>
                            <Text style={styles.btnText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                    {/* <Button title="Register" onPress={handleRegister} /> */}
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
        backgroundColor: '#fff',
        width: 100,
        height: 100,
        borderRadius: 100,
        justifyContent: 'center',
        alignContent: 'center'
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
      },
      text: {
        fontSize: 15,
        fontFamily: 'serif',
        fontWeight: 'bold',
        color: 'white'
      },
});

export default Register;
