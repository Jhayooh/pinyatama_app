import React, { useState } from 'react'
import { Text,
  Modal,
  Alert,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  ImageBackground} from 'react-native'
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';

const data = [
  { label: 'Item 1', value: '1' },
  { label: 'Item 2', value: '2' },
  { label: 'Item 3', value: '3' },
  { label: 'Item 4', value: '4' },
  { label: 'Item 5', value: '5' },
  { label: 'Item 6', value: '6' },
  { label: 'Item 7', value: '7' },
  { label: 'Item 8', value: '8' },
];

export const Calculator = () => {
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <ImageBackground source={require('../assets/brakrawnd.png')} resizeMode="cover" style={styles.image}>
        <View style={{flex: 1, alignItems: 'center',}}>
          <Image source={require('../assets/icon.png')} style={{width: 120, height: 110}} />
          <TouchableOpacity style={styles.touch} onPress={()=>{
            setShowModal(true)
          }}>
            <Text>Paglagay ng Pagsusuri</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>

    <Modal animationType='fade' transparent={true} visible={showModal} onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setModalVisible(!modalVisible);
        }}>
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>

            <Text>COST AND RETURN ANALYSIS PINEAPPLE PRODUCTION</Text>
            <View>
              <Text>PARTICULAR</Text>
              <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={data}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? 'Select item' : '...'}
          searchPlaceholder="Search..."
          value={value}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            setValue(item.value);
            setIsFocus(false);
          }}
          renderLeftIcon={() => (
            <AntDesign
              style={styles.icon}
              color={isFocus ? 'blue' : 'black'}
              name="Safety"
              size={20}
            />
          )}
        />
        <TouchableOpacity style={styles.touch} onPress={()=>{
            setShowModal(!showModal)
          }}>
            <Text>Magbalik</Text>
          </TouchableOpacity>
            </View>
          </View>
          </View>
    </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  touch: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#206830',
    alignItems: 'center'
    },
    modalBackground: {
      backgroundColor: '#00000060',
      padding: 20,
      justifyContent: 'center',
      flex: 1
    },
    modalContainer: {
      backgroundColor: '#fff',
      padding: 24,
    },
    image: {
      flex: 1,
      opacity: .8,
      paddingVertical: 36,
      paddingHorizontal: 12,
    },
    container: {
      backgroundColor: 'white',
      padding: 16,
    },
    dropdown: {
      height: 50,
      borderColor: 'gray',
      borderWidth: 0.5,
      borderRadius: 8,
      paddingHorizontal: 8,
    },
    icon: {
      marginRight: 5,
    },
    label: {
      position: 'absolute',
      backgroundColor: 'white',
      left: 22,
      top: 8,
      zIndex: 999,
      paddingHorizontal: 8,
      fontSize: 14,
    },
    placeholderStyle: {
      fontSize: 16,
    },
    selectedTextStyle: {
      fontSize: 16,
    },
    iconStyle: {
      width: 20,
      height: 20,
    },
    inputSearchStyle: {
      height: 40,
      fontSize: 16,
    },
})