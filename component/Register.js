import React, { useState } from 'react'
import { address } from 'addresspinas';
import {
    View,
    Text,
    Button,
    SafeAreaView,
    TouchableOpacity,
    Image,
    StyleSheet,
    Alert,
    Modal,
    Platform,
    TextInput
} from 'react-native'
import {
    Input,
    NativeBaseProvider,
    FormControl,
    WarningOutlineIcon,
    Box,
    Select,
    CheckIcon
} from "native-base";
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';
import * as ImagePicker from 'expo-image-picker';
import { collection, addDoc, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from '../firebase/Config';

import backIcon from '../assets/back.png'
import noProf from '../assets/noProf.png'
import camera from '../assets/upload.png'
import gallery from '../assets/gallery.png'
import cancel from '../assets/close.png'
import { db } from '../firebase/Config';


const styles = StyleSheet.create({
    safeArea: {
        // backgroundColor: 'red',
        flex: 1,
        paddingTop: Platform.OS === 'android' ? 25 : 0,
    },
    topContainer: {
        paddingTop: 12,
        paddingHorizontal: 12
    },
    bottomContainer: {
        // backgroundColor: 'yellow',
        flex: 1,
        paddingHorizontal: 32,
        paddingVertical: 18,
        justifyContent: 'flex-start'
    },
    textTitle: {
        fontSize: 26,
        fontWeight: '600',

    },
    input: {
        color: '#333',
        fontSize: 20,
        borderRadius: 8,
        borderWidth: 1,
        height: 50,
        padding: 10,
        borderColor: '#E8E7E7',

    },
    input1: {
        color: '#333',
        fontSize: 20,
    },
    formcontrol: {
        marginTop: 14
    },
    avatar: {
        width: 150,
        height: 150,
        borderRadius: 75,
        borderWidth: 3,
        borderColor: '#686868'
    },
    addProfContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    addProfCenter: {
        backgroundColor: '#fff',
        padding: 24,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 16,

    },
    addProfTitle: {
        fontSize: 20,
        fontWeight: '600'

    },
    addProfBtn: {
        padding: 8,
        alignItems: 'center',
        justifyContent: 'center'
    },
    addProfBtnText: {
        fontSize: 16,
        marginTop: 12
        // fontWeight: '600'
    }
})

export default function Register({ navigation }) {
    const [munCode, setMunCode] = useState(null)
    const [imageUri, setImageUri] = useState(null)

    const municipalities = address.getCityMunOfProvince('0516')
    const brgy = address.getBarangaysOfCityMun(munCode)

    const [barangay, setBarangay] = useState('')
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('')
    const [mun, setMun] = useState('')
    const [password, setPassword] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [photoUrl, setPhotoUrl] = useState(null)
    const [displayName, setDisplayName] = useState('')

    const [profShow, setProfShow] = useState(false)

    const [firstnameError, setFirstnameError] = useState('');
    const [lastnameError, setLastnameError] = useState('');
    const [munError, setMunError] = useState('');
    const [brgyError, setBrgyError] = useState('');
    const [emailError, setPhoneError] = useState('');
    const [displayError, setDisplayError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    function handleNext(){
        if (!firstName){
            Alert.alert('Farmer Name', 'Maglagay ng pangalan ng magsasaka')
            return
        }
    }
    const handleRegister = async () => {
        const usersRef = collection(db, 'users')
        try {
            const docRef = await addDoc(usersRef, {
                brgy: barangay,
                disabled: false,
                displayName: displayName,
                email: email,
                status: 'pending',
                mun: mun,
                password: password,
                phoneNumber: phoneNumber,
                photoURL: photoUrl,
                uid: '1'
            });
            await uploadImages(docRef)
            navigation.goBack()
        } catch (e) {
        }
    }

    const openGallery = async () => {
        try {

            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: .6,
            });

            if (!result.canceled) {
                setImageUri(result.assets[0].uri)
                setProfShow(false)
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
                allowsEditing: true,
                aspect: [1, 1],
                quality: .6
            })

            if (!result.canceled) {
                setImageUri(result.assets[0].uri)
                setProfShow(false)
            }
        } catch (e) {
            console.log(e);
        }
    }

    const uploadImages = async (docRef) => {
        try {
            const response = await fetch(imageUri);
            const blob = await response.blob();

            const storageRef = ref(storage, `ProfileImages/${docRef.id}`);
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
                    getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                        await updateDoc(docRef, {
                            uid: docRef.id,
                            photoURL: downloadURL
                        })
                    }).catch((error) => {
                        console.error("Error getting download URL: ", error);
                    });
                }
            );
        } catch (error) {
            console.error("Error uploading image: ", error);
        }
    };

    const progressStepsStyle = {
        activeStepIconBorderColor: '#22b14c',
        activeLabelColor: '#686868',
        activeStepNumColor: 'white',
        activeStepIconColor: '#22b14c',
        completedStepIconColor: '#686868',
        completedProgressBarColor: '#686868',
        completedCheckColor: '#4bb543'
    };
    const viewProps = {
        flex: 1,
    };
    const nxtButton = {
        backgroundColor: '#22b14c',
        borderRadius: 12,
        paddingHorizontal: 32,
        paddingVertical: 12,
    };
    const nxtButtonText = {
        color: '#fff',
    }

    const AddProfile = () => {
        const handleClose = () => {
            setProfShow(!profShow)
        }
        return (
            <Modal animationType='fade' transparent={true} visible={profShow} onRequestClose={handleClose}>
                <View style={styles.addProfContainer}>
                    <View style={styles.addProfCenter}>
                        <Text style={styles.addProfTitle}>Display Photo</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 24, marginTop: 16 }}>
                            <TouchableOpacity style={styles.addProfBtn} onPress={openCamera}>
                                <Image source={camera} />
                                <Text style={styles.addProfBtnText}>Camera</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.addProfBtn} onPress={openGallery}>
                                <Image source={gallery} />
                                <Text style={styles.addProfBtnText}>Gallery</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.addProfBtn} onPress={handleClose}>
                                <Image source={cancel} />
                                <Text style={styles.addProfBtnText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }


    return (
        <NativeBaseProvider>
            <SafeAreaView style={styles.safeArea}>
                {/* <View style={styles.topContainer}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image source={backIcon} style={{ width: 40, height: 40 }} />
                    </TouchableOpacity>
                </View> */}
                <View style={styles.bottomContainer}>
                    <Text style={styles.textTitle}>Create an Account</Text>
                    <ProgressSteps >
                        <ProgressStep
                            label="Personal Information"
                            scrollable={false}
                            viewProps={viewProps}
                            nextBtnStyle={nxtButton}
                            nextBtnTextStyle={nxtButtonText}>
                            <Box style={{ flex: 1 }}>
                                <FormControl isRequired style={styles.formcontrol}>
                                    <FormControl.Label>Firstname</FormControl.Label>
                                    <TextInput
                                        editable
                                        value={firstName}
                                        placeholder='Enter Firstname'
                                        style={[styles.input, firstnameError ? { borderColor: 'red', borderWidth: 1 } : null]}
                                        onChangeText={(fName) => {
                                            setFirstName(fName);
                                            if (fName.trim() === '') {
                                                setFirstnameError('This is required field');
                                            } else {
                                                setFirstnameError('');
                                            }
                                        }}
                                    />
                                    {firstnameError ? <Text style={{ color: 'red', fontSize: 12 }}>{firstnameError}</Text> : null}
                                </FormControl>

                                <FormControl isRequired style={styles.formcontrol}>
                                    <FormControl.Label>Lastname</FormControl.Label>
                                    <TextInput
                                        editable={!firstnameError}
                                        value={lastName}
                                        placeholder='Enter Lastname'
                                        style={[styles.input, lastnameError ? { borderColor: 'red', borderWidth: 1 } : null]}
                                        onChangeText={(lName) => {
                                            setLastName(lName);
                                            if (lName.trim() === '') {
                                                setLastnameError('This is required field');
                                            } else {
                                                setLastnameError('');
                                            }
                                        }} />
                                    {lastnameError ? <Text style={{ color: 'red', fontSize: 12 }}>{lastnameError}</Text> : null}
                                </FormControl>

                                <FormControl isRequired style={styles.formcontrol}>
                                    <FormControl.Label>Select Municipality</FormControl.Label>
                                    <Select
                                        selectedValue={munCode}
                                        style={styles.input1}
                                        minWidth="200"
                                        accessibilityLabel="Municipality"
                                        placeholder="Choose Municipality"
                                        _selectedItem={{
                                            bg: "teal.600",
                                            endIcon: <CheckIcon size={5} />
                                        }}
                                        onValueChange={item => {
                                            setMunCode(item)
                                            const foundItem = municipalities.cityAndMun.find(entry => entry.mun_code === item);
                                            setMun(foundItem ? foundItem.name : '');
                                            console.log(foundItem ? foundItem.name : '');
                                        }}
                                    >
                                        {
                                            municipalities.cityAndMun.map((mun) => {
                                                return (
                                                    <Select.Item key={mun.mun_code} label={mun.name} value={mun.mun_code} />
                                                )
                                            })
                                        }
                                        <Select.Item label="UX Research" value="ux" />
                                    </Select>
                                </FormControl>

                                <FormControl isRequired style={styles.formcontrol}>
                                    <FormControl.Label>Baranggay</FormControl.Label>
                                    <Select selectedValue={barangay} style={styles.input1} minWidth="200" accessibilityLabel="Baranggay" placeholder="Baranggay" _selectedItem={{
                                        bg: "teal.600",
                                        endIcon: <CheckIcon size={5} />
                                    }} onValueChange={(item) => setBarangay(item)}>
                                        {
                                            brgy.barangays.map((b, index) => {
                                                return (
                                                    <Select.Item key={index} label={b.name} value={b.name} />
                                                )
                                            })
                                        }
                                    </Select>
                                </FormControl>
                            </Box>
                        </ProgressStep>
                        <ProgressStep
                            label="Second Step"
                            nextBtnStyle={nxtButton}
                            nextBtnTextStyle={nxtButtonText}>
                            <Box style={{ flex: 1 }}>
                                <FormControl isRequired style={styles.formcontrol}>
                                    <FormControl.Label>Email</FormControl.Label>
                                    <Input size='xl' value={email} placeholder='Enter your Email' style={styles.input} onChangeText={(e) => setEmail(e)} />
                                </FormControl>
                                <FormControl isRequired style={styles.formcontrol}>
                                    <FormControl.Label>Phone Number</FormControl.Label>
                                    <Input size='xl' type='' value={phoneNumber} placeholder='Enter your Phone Number' style={styles.input} onChangeText={(pNum) => setPhoneNumber(pNum)} />
                                </FormControl>
                            </Box>
                        </ProgressStep >
                        <ProgressStep label="Account Information" onSubmit={() => {
                            Alert.alert(
                                'Sign up account.',
                                'are you sure you want to sign up this account?',
                                [
                                    {
                                        text: 'Cancel',
                                        onPress: () => console.log('Cancel Pressed'),
                                        style: 'cancel',
                                    },
                                    {
                                        text: 'Yes',
                                        onPress: handleRegister,
                                    }
                                ]
                            )
                        }}
                            nextBtnStyle={nxtButton}
                            nextBtnTextStyle={nxtButtonText}>
                            <Box style={{ flex: 1 }} >
                                <Box style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                                    <Image source={imageUri ? { uri: imageUri } : noProf} style={styles.avatar} />
                                    <Button title='add profile' onPress={() => setProfShow(true)} />
                                </Box>
                                <Box style={{}}>
                                    <FormControl isRequired style={styles.formcontrol}>
                                        <FormControl.Label>Display Name</FormControl.Label>
                                        <TextInput size='xl' value={displayName} placeholder='Enter desired display name' style={styles.input} onChangeText={(dName) => setDisplayName(dName)} />
                                    </FormControl>
                                    <FormControl isRequired style={styles.formcontrol}>
                                        <FormControl.Label>Password</FormControl.Label>
                                        <TextInput size='xl' value={password} type='password' placeholder='Enter your password' style={styles.input} onChangeText={(pWord) => setPassword(pWord)} />
                                    </FormControl>
                                </Box>
                            </Box>
                        </ProgressStep>
                    </ProgressSteps>
                </View>
            </SafeAreaView>
            <AddProfile />
        </NativeBaseProvider>

    )
}

