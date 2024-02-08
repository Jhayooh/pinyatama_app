import {useState} from 'react'
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    TextInput,
    StyleSheet
  } from "react-native";
  import { db } from '../firebase/Config'
  import { collection, addDoc, updateDoc } from 'firebase/firestore'

export const AddDataRow = ({ path }) => {
    const [showRow, setShowRow] = useState(false)

    const [name, setName] = useState('')
    const [qnty, setQnty] = useState(0)
    const [unit, setUnit] = useState('')
    const [pUnit, setPunit] = useState(0)

    const handleAddRow = async () => {
        const docRef = collection(db, path)
        setShowRow(false)
        try {
            const addNewDoc = await addDoc(docRef, {
                name: name,
                qnty: qnty,
                unit: unit,
                pUnit: pUnit,
                total: calTotal(qnty, pUnit)
            })
            setName('')
            setQnty(0)
            setUnit('')
            setPunit(0)
            await updateDoc(addNewDoc, {
                id: addNewDoc.id
            })
        } catch (error) {
            console.log(error)
        }
    }

    const calTotal = (numOne, numTwo) => {
        return numOne * numTwo
    }

    return (
        <>
            <TouchableOpacity style={styles.bottomButtonItem} onPress={() => setShowRow(true)}>
                <Text>Add Data</Text>
            </TouchableOpacity>

            <Modal animationType='fade' transparent={true} visible={showRow} onRequestClose={() => (setShowRow(!showRow))}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        {/* name */}
                        <Text style={styles.modalTitle}>Add New Table</Text>
                        <Text style={styles.modalLabel}>Name</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={setName}
                            value={name}
                            placeholder='Name'
                            placeholderTextColor='red'
                        />
                        {/* qnty */}
                        <Text style={styles.modalLabel}>Quantity</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={setQnty}
                            value={qnty}
                            placeholder='Quantity'
                            placeholderTextColor='red'
                        />
                        {/* unit */}
                        <Text style={styles.modalLabel}>Unit</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={setUnit}
                            value={unit}
                            placeholder='Unit'
                            placeholderTextColor='red'
                        />
                        {/* pUnit */}
                        <Text style={styles.modalLabel}>Price per unit</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={setPunit}
                            value={pUnit}
                            placeholder='Price per unit'
                            placeholderTextColor='red'
                        />
                        <View style={styles.bottomButton}>
                            <TouchableOpacity style={styles.bottomButtonItem} onPress={() => handleAddRow()}>
                                <Text>Add</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.bottomButtonItem} onPress={() => setShowRow(!showRow)}>
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