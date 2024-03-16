import { addDoc, collection, doc, getDoc, updateDoc, query } from 'firebase/firestore';
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

export const TableBuilder = ({ data, input }) => {
  console.log("data tablebuilder:", data);
  const [Hectares, setHectares] = useState(0)
  const plantingMaterials = data.find(item => item.name === "Planting Materials");
  const ferZero = data.find(item => item.name === "0-0-60");
  const ferUrea = data.find(item => item.name === "Urea");
  const Diuron = data.find(item => item.name === "Diuron");
  const Sticker = data.find(item => item.name === "Sticker");


  const [totalPrice, setTotalPrice] = useState(0)

  // const docRef = doc(db, path, name)

  // const [total, setTotal] = useState(0)
  // const [totalCost, setTotalCost] = useState(0)
  // const updateTotalInputs = async (newTotal) => {
  //   try {
  //     await updateDoc(docRef, {
  //       totalInputs: newTotal
  //     });
  //   } catch (error) {
  //     console.error("Error updating totalInputs:", error);
  //   }
  // };

  // useEffect(() => {
  //   if (docs) {
  //     let sum = 0
  //     docs.forEach(doc => {
  //       sum += doc.total;
  //     });
  //     setTotal(sum);
  //     updateTotalInputs(sum)
  //   }
  // }, [docs]);

  const getMult = (numOne, numTwo) => {
    const num = numOne * numTwo
    return parseFloat(num.toFixed(0))
  }

  const TableData = ({ name, qnty, unit, price, totalPrice }) => {
    console.log(name, qnty, unit, price, totalPrice);
    // const totalPrice = calcTotalPrice(data.qnty, data.pUnit)
    return (
      <View style={styles.tableData}>
        <View style={{ ...styles.tableHeadLabel3, alignItems: 'flex-start' }}>
          <Text>{name}</Text>
        </View>
        <View style={{ ...styles.tableHeadLabel2, alignItems: 'center' }}>
          <Text>{qnty.toLocaleString()}</Text>
        </View>
        <View style={{ ...styles.tableHeadLabel2, alignItems: 'center' }}>
          <Text>{unit}</Text>
        </View>
        <View style={{ ...styles.tableHeadLabel2, alignItems: 'flex-end' }}>
          <Text>{price.toLocaleString()}</Text>
        </View>
        <View style={{ ...styles.tableHeadLabel2, alignItems: 'flex-end' }}>
          {/* {setTotal(total + totalPrice)} */}
          <Text>{totalPrice.toLocaleString()}</Text>
        </View>
      </View>
    )
  }
  useEffect(() => {
    const number = input / 30000
    setHectares(number)
  }, [input])

  console.log(plantingMaterials);

  const pmQnty = getMult(Hectares, 30000)
  const fZeroQnty = getMult(Hectares, 5)
  const fUreaQnty = getMult(Hectares, 5)
  const dQnty = getMult(Hectares, 2)
  const sQnty = getMult(Hectares, 1)

  return (
    <>
      <View style={{ ...styles.container, minHeight: 300, marginTop: 12, borderRadius: 10 }}>
        <View style={{ flex: 1, alignItems: 'center', margin: 8 }}>
          <Text style={{ backgroundColor: '#3bcd6b', padding: 8, alignItems: 'center', textAlign: 'center' }}>COST AND RETURN ANALYSIS {Hectares.toFixed(2)} HA PINEAPPLE PRODUCTION</Text>
        </View>
        <View style={{ flex: 1, marginTop: 6, marginHorizontal: 12 }}>
          {/* Header */}
          <View style={{ ...styles.tableHead, borderBottomWidth: 2, borderColor: '#000', }}>
            <View style={{ ...styles.tableHeadLabel3, alignItems: 'center' }}>
              <Text>PARTICULARS</Text>
            </View>
            <View style={{ ...styles.tableHeadLabel2, alignItems: 'center' }}>
              <Text>QUANTITY</Text>
            </View>
            <View style={{ ...styles.tableHeadLabel2, alignItems: 'center' }}>
              <Text>UNIT</Text>
            </View>
            <View style={{ ...styles.tableHeadLabel2, alignItems: 'center' }}>
              <Text>PRICE/UNIT</Text>
            </View>
            <View style={{ ...styles.tableHeadLabel2, alignItems: 'flex-end' }}>
              <Text>TOTAL PRICE</Text>
            </View>
          </View>

          {/* Body */}
          <View style={{ ...styles.tableHead }}>
            <View>
              <Text styles={{ fontWeight: 'bold' }}>Materials Inputs:</Text>
            </View>
          </View>
          <TableData
            name={plantingMaterials.name}
            qnty={pmQnty}
            unit={plantingMaterials.unit}
            price={plantingMaterials.price}
            totalPrice={getMult(pmQnty, plantingMaterials.price)}
          />
          <View style={{ ...styles.tableHead }}>
            <View>
              <Text styles={{ fontWeight: 'bold' }}>Fertilizer</Text>
            </View>
          </View>
          <TableData
            name={ferZero.name}
            qnty={fZeroQnty}
            unit={ferZero.unit}
            price={ferZero.price}
            totalPrice={getMult(fZeroQnty, ferZero.price)}
          />
          <TableData
            name={ferUrea.name}
            qnty={fUreaQnty}
            unit={ferUrea.unit}
            price={ferUrea.price}
            totalPrice={getMult(fUreaQnty, ferUrea.price)}
          />
          <TableData
            name={Diuron.name + " (2x)"}
            qnty={dQnty}
            unit={Diuron.unit}
            price={Diuron.price}
            totalPrice={getMult(dQnty, Diuron.price)}
          />
          <TableData
            name={Sticker.name}
            qnty={sQnty}
            unit={Sticker.unit}
            price={Sticker.price}
            totalPrice={getMult(sQnty, Sticker.price)}
          />
          <View style={{ ...styles.tableHead, borderTopWidth: 2, borderBottomWidth: 2 }}>
            <View style={{ flex: 4 }}>
              <Text styles={{ fontWeight: 'bold' }}>Total Material Input: </Text>
            </View>
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <Text styles={{ fontWeight: 'bold' }}>{
                (
                  getMult(pmQnty, plantingMaterials.price) +
                  getMult(fUreaQnty, ferUrea.price) +
                  getMult(fZeroQnty, ferZero.price) +
                  getMult(dQnty, Diuron.price) +
                  getMult(sQnty, Sticker.price)
                ).toLocaleString()
              }</Text>
            </View>
          </View>
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    // padding: 6,
    // backgroundColor: '#3bcd6b',
    alignSelf: 'stretch',
    // marginBottom: '16'
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
    marginTop: 8,
    // borderBottomWidth: 1,
    // borderColor: '#ddd',
    // padding: 6,
    // backgroundColor: '#fff',
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