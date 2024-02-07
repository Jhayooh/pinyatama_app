import React, { useState, useEffect } from 'react'
import { 
    View,
    Text,
    ScrollView,
    StyleSheet,
    ImageBackground,
    Button,
    Modal,
    TouchableOpacity,
    TextInput
   } from "react-native";
 import { db } from '../firebase/Config'
 import { collection, docs, getDocs, getFirestore, onSnapshot, setDoc, doc } from 'firebase/firestore'
 import { useCollectionData, useCollectionDataOnce } from "react-firebase-hooks/firestore";

const AddDataRow = () => {
  
  return (
    <TouchableOpacity style={styles.bottomButtonItem} onPress={() => setIsShow(true)}>
      <Text>Add Data</Text>
    </TouchableOpacity>
  )
}

const TableHead = ({ headers }) => { 
  const header = [
    'quantity',
    'unit',
    'price/unit',
    'total'
  ]

  header.splice(0,0, headers)
  console.log(header)

  return (
    <View style={styles.tableHead}>
      {header.map((head, index) => (
        <View style={index == 0 ? styles.tableHeadLabel3 : styles.tableHeadLabel2 }>
          <Text style={{alignItems: 'flex-start'}}>{head}</Text>
        </View>
      ))}
    </View>
  )
}

const TableData = ({ data }) => {
  console.log(data)
  return (
    <View style={styles.tableData}>
      <View style={styles.tableHeadLabel3}>
        <Text>{data.name}</Text>
      </View>
      <View style={styles.tableHeadLabel2}>
        <Text>{data.qnty}</Text>
      </View>
      <View style={styles.tableHeadLabel2}>
        <Text>{data.unit}</Text>
      </View>
      <View style={styles.tableHeadLabel2}>
        <Text>{data.pUnit}</Text>
      </View>
      <View style={styles.tableHeadLabel2}>
        <Text>{data.total}</Text>
      </View>
    </View>
  )
}

const TableDataChild = ({ path }) => {
  console.log(path)
  const query = collection(db, path)
  const [docs, loading, error] = useCollectionData(query)
  return (
    <>
    {docs?.map(doc => (
      <TableData key={doc.id} data={doc} />
    ))}
    </>
  )
}

const TableBuilder = ({headers, path}) => {
  const query = collection(db, path);
  const [docs, loading, error] = useCollectionData(query);
  
  return (
    <View style={{marginBottom: 24}} >
    <TableHead headers={headers}/>
    {docs?.map((doc)=>(
      <>
      <TableData data={doc} />
      <TableDataChild path={`${path}/${doc.id}/${doc.name}`}/>
      </>
    ))}
    <AddDataRow />
    {/* {items.map(data => (
      <>
      <TableData data={data}/>
      {data.child && data.child.map(child => (
        <TableData key={child.id} data={child} />
      ))}
      </>
      ))} */}
    </View>
  )
}

const ProductionInput = () => {
  const [materials, setMaterials] = useState([])
  const [isShow, setIsShow] = useState(false)
  const [text, onChangeText] = React.useState('Useless Text');
  const [number, onChangeNumber] = React.useState('');

  const [name, setName] = useState('')
  const [qnty, setQnty] = useState(0)
  const [unit, setUnit] = useState('')
  const [pUnit, setPunit] = useState(0)
  const [total, setTotal] = useState(0)

  const collParticular = collection(db, 'particulars')
  const [docs, loading, error] = useCollectionData(collParticular);

  const addDocumentWithId = async () => {
    try {
      const documentRef = doc(collParticular, name); // Create a reference to the document with the specified ID
      await setDoc(documentRef, {name: name}); // Set an empty object as the document data
      console.log(`Document with ID ${name} added to collection ${collParticular}.`);
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

        {/* Table Container */}
        <ScrollView style={styles.scrollView}>
          <Text style={styles.texts}>PARTICULAR</Text>

          {/* Table Heads */}
          {docs?.map((doc) =>(
            <TableBuilder headers={doc.name} path={`particulars/${doc.name}/${doc.name}`} style={{marginBottom: 24}} />
          ))}
        </ScrollView>

        {/* button view */}
        <View style={styles.bottomButton}>
          <TouchableOpacity style={styles.bottomButtonItem} onPress={() => setIsShow(true)}>
              <Text>Add</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.bottomButtonItem}>
              <Text>Save</Text>
            </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>

    {/* // modal */}
    <Modal animationType='fade' transparent={true} visible={isShow} onRequestClose={()=>(setIsShow(!isShow))}>
    <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Table</Text>
            <TextInput
              style={styles.input}
              onChangeText={setName}
              value={name}
            />
          <View style={styles.bottomButton}>
            <TouchableOpacity style={styles.bottomButtonItem} onPress={()=>addDocumentWithId()}>
                <Text>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.bottomButtonItem} onPress={()=>setIsShow(false)}>
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
    alignItems: 'flex-end',
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
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
})

export default ProductionInput