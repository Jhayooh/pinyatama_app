import { collection, doc, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import {
  ActivityIndicator,
  ImageBackground,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image
} from "react-native";
import { auth, db } from '../firebase/Config';
import { BottomButton } from './BottomButton';
import Charts from './Charts';
import { TableBuilder } from './TableBuilder';

const ProductionInput = ({ route, navigation }) => {
  const [user] = useAuthState(auth)
  const { farms = [] } = route.params
  const farm = farms[0]
  const [edit, setEdit] = useState(false)
  const [roiDetails, setRoiDetails] = useState({})

  const componentsColl = collection(db, `farms/${farm.id}/components`)
  const [compData, compLoading, compError] = useCollectionData(componentsColl)

  const addDocumentWithId = async () => {
    setIsShow(false)
    onChangeText('')
    try {
      const documentRef = doc(collParticular, text);
      await setDoc(documentRef, { name: text, totalInputs: 0 });
    } catch (error) {
      console.error('Error adding document:', error);
    }
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <ImageBackground resizeMode="cover" style={styles.image}>
          <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', gap: 3}}>
            <Text style={styles.name}>{farm.title}</Text>
            <TouchableOpacity style={{ height: 32, alignItems: 'center', justifyContent: 'center', paddingTop:20}} onPress={() => {
              setEdit(!edit)
            }}>
              <Image source={require('../assets/edit.png')} style={{width:20, height:20}}/>
            </TouchableOpacity>
          </View>
          <Text style={styles.loc}>{`${farm.mun}, ${farm.brgy}`}</Text>
          <Text style={styles.label}>Pagsusuri ng Paggastos at Pagbabalik sa Produksiyon ng Pinya</Text>

          {edit
            ?
            <>
              {/* Table Container */}
              < ScrollView style={styles.scrollView}>
                <Text style={styles.texts}>PARTICULARS</Text>

                {/* Table Heads */}
                {
                  compLoading
                    ?
                    <ActivityIndicator size='small' color='#3bcd6b' style={{ padding: 64, backgroundColor: '#fff' }} />
                    :
                    <TableBuilder
                      components={compData}
                      area={farm.area}
                      setRoiDetails={setRoiDetails}
                    />
                }
              </ScrollView>
            </>
            :
            <Charts farms={farms} />
          }
        </ImageBackground>
      </SafeAreaView >

      {/* // modal */}
      {/* <Modal animationType='fade' transparent={true} visible={isShow} onRequestClose={() => (setIsShow(!isShow))}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Table</Text>
            <TextInput
              style={styles.input}
              onChangeText={onChangeText}
              value={text}
              placeholder='Add Name'
            />
          </View>
        </View>
      </Modal> */}
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent:'center',
    alignItems:'center',
  },
  image: {
    flex: 1,
    // opacity: .5,
    padding: 12,
    backgroundColor:'#22b14c',
    padding:20

  },
  name: {
    fontSize: 32,
    paddingTop:20,
    color: 'green',
    fontWeight: '700',
  },
  loc: {
    fontSize: 16,
    color: 'black',
    fontWeight: '700',
    marginTop: 6
  },
  label: {
    // flex: 'row',
    alignItems:'center',
    marginTop: 18,
    fontSize:23,
    justifyContent:'center',
    fontWeight: 'bold',
    fontFamily: 'serif',
    color:'white'

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

export default ProductionInput