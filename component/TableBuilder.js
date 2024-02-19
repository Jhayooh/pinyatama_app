import { addDoc, collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import { useCollectionData } from "react-firebase-hooks/firestore";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View
} from "react-native";
import { db } from '../firebase/Config';
import { AddDataRow } from './AddDataRow';

const Total = ({ total, name }) => {

  return (
    <View style={{ ...styles.tableData, padding: 12 }}>
      <Text style={{ flex: 4, fontWeight: 'bold', fontSize: 18 }}>Total {name} Inputs</Text>
      <Text style={{ flex: 1, fontWeight: 'bold', fontSize: 18 }}>{total}</Text>
    </View>
  )
}

const TableHead = ({ headers }) => {
  const header = [
    'quantity',
    'unit',
    'price/unit',
    'total'
  ]

  header.splice(0, 0, headers)

  return (
    <View style={styles.tableHead}>
      {header.map((head, index) => (
        <View key={index} style={index == 0 ? styles.tableHeadLabel3 : styles.tableHeadLabel2}>
          <Text style={{ alignItems: 'flex-start' }}>{head}</Text>
        </View>
      ))}
    </View>
  )
}

const TableData = ({ data }) => {
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
  // console.log(path)
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

export const TableBuilder = ({ name, path }) => {
  const query = collection(db, path);
  const [docs, loading, error] = useCollectionData(query);
  const docRef = doc(db, 'particulars', name)

  const [total, setTotal] = useState(0)  

  const updateTotalInputs = async (newTotal) => {
    try {
      await updateDoc(docRef, {
        totalInputs: newTotal
      });
    } catch (error) {
      console.error("Error updating totalInputs:", error);
    }
  };

  useEffect(() => {
    if (docs) {
      let sum = 0
      docs.forEach(doc => {
        sum += doc.total;
      });
      setTotal(sum);

      updateTotalInputs(sum)
    }
  }, [docs]);

  return (
    <View style={{ marginBottom: 6 }} >
      <TableHead headers={name} />
      {
        loading
          ?
          <ActivityIndicator size='small' color='#3bcd6b' style={{ padding: 12, backgroundColor: '#fff' }} />
          :
          docs?.map((doc) => (
            <View key={doc.id} style={{flex: 1}}>
              <TableData data={doc} />
              <TableDataChild path={`${path}/${doc.id}/${doc.name}`} />
            </View>
          ))}
      {total !== 0 && <Total total={total} name={name} />}
      <AddDataRow path={path} />
    </View>
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