import { addDoc, collection, doc, setDoc, updateDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { useCollectionData } from "react-firebase-hooks/firestore";
import {
  ActivityIndicator,
  ImageBackground,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { db } from '../firebase/Config';
import { TableBuilder } from './TableBuilder';
import { BottomButton } from './BottomButton';
import { auth } from '../firebase/Config';
import { useAuthState } from 'react-firebase-hooks/auth';

const DataInputs = ({ navigation, route }) => {
  const [materials, setMaterials] = useState([])
  const [isShow, setIsShow] = useState(false)
  const [user] = useAuthState(auth)

  const [edit, setEdit] = useState(false)

  const [text, onChangeText] = useState('');
  const path = `farms/${user.uid}/particulars`

  const collParticular = collection(db, path)
  const [docs, loading, error] = useCollectionData(collParticular);
  console.log("laman ng docs: ", docs);
  console.log(collParticular);
  console.log(user.uid);

  const addDocumentWithId = async () => {
    setIsShow(false)
    onChangeText('')
    try {
      await setDoc(doc(collParticular, text), { name: text, totalInputs: 0, uid: user.uid });
    } catch (error) {
      console.error('Error adding document:', error);
    }
  };
  return (
    <>
      <View style={styles.container}>
        <ImageBackground source={require('../assets/brakrawnd.png')} resizeMode="cover" style={styles.image}>
          <Text style={styles.name}>Pangalan ng Bukid</Text>
          <Text style={styles.loc}>Daet, Camarines Norte</Text>
          <Text style={styles.label}>Pagsusuri ng Paggastos at Pagbabalik sa Produksiyon ng Pinya</Text>

          <>
            {/* Table Container */}
            < ScrollView style={styles.scrollView}>
              <Text style={styles.texts}>PARTICULAR</Text>

              {/* Table Heads */}
              {
                loading
                  ?
                  <ActivityIndicator size='small' color='#3bcd6b' style={{ padding: 64, backgroundColor: '#fff' }} />
                  :
                  docs?.map((doc) => (
                    <TableBuilder
                      key={doc.name}
                      name={doc.name}
                      path={`${path}/${doc.name}/${doc.name}`}
                    />
                  ))}
            </ScrollView>
            <BottomButton setShow={setIsShow} navigation={navigation} />
          </>

        </ImageBackground>
      </View >

      {/* // modal */}
      <Modal animationType='fade' transparent={true} visible={isShow} onRequestClose={() => (setIsShow(!isShow))}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Table</Text>
            <TextInput
              style={styles.input}
              onChangeText={onChangeText}
              value={text}
              placeholder='Add Name'
            />
            <View style={styles.bottomButton}>
              <TouchableOpacity style={styles.bottomButtonItem} onPress={() => addDocumentWithId()}>
                <Text>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.bottomButtonItem} onPress={() => setIsShow(false)}>
                <Text>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#206830',
  },
  image: {
    flex: 1,
    opacity: .8,
    paddingVertical: 36,
    paddingHorizontal: 12,
  },
  name: {
    fontSize: 32,
    color: '#fff',
    fontWeight: '700',
  },
  loc: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '700',
    marginTop: 6
  },
  label: {
    backgroundColor: "#E3E55A",
    fontSize: 11,
    alignSelf: "center",
    paddingVertical: 8,
    paddingHorizontal: 2,
    marginTop: 18,
    fontWeight: 'bold',
    justifyContent: 'center'

  },
  scrollView: {
    marginTop: 12,
    flex: 1,
  },
  texts: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
  },
  tableHead: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    padding: 6,
    backgroundColor: '#3bcd6b',
    alignSelf: 'stretch',
    marginBottom: '16'
  },
  tableHeadLabel2: {
    flex: 2,
    alignSelf: 'stretch'
  },
  tableHeadLabel3: {
    flex: 3,
    alignSelf: 'stretch'
  },
  tableData: {
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    padding: 6,
    backgroundColor: '#fff',
    flex: 1,
    alignSelf: 'stretch',
    flexDirection: 'row'
  },
  bottomButton: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 12
  },
  bottomButtonItem: {
    backgroundColor: '#3bcd6b',
    flex: 1,
    padding: 12,
    alignItems: 'center'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    backgroundColor: 'white',
    width: 280,
    padding: 20,
    borderRadius: 10,
    elevation: 5, // Android shadow
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
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
})

export default DataInputs