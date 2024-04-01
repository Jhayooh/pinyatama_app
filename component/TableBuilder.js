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

export const TableBuilder = ({ components, area }) => {
  const [laborTotal, setLaborTotal] = useState(0)
  const [materialTotal, setMaterialTotal] = useState(0)

  useEffect(() => {
    let materialSum = 0;
    let laborSum = 0;

    components.forEach((component) => {
      if (component.particular.toLowerCase() === 'material') {
        materialSum += parseInt(component.totalPrice);
      } else if (component.particular.toLowerCase() === 'labor') {
        laborSum += parseInt(component.totalPrice);
      }
    });

    setMaterialTotal(materialSum);
    setLaborTotal(laborSum);
  }, [components]);

  const TableData = ({ name, qnty, unit, price, totalPrice }) => {
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

  return (
    <>
      <View style={{ ...styles.container, minHeight: 300, borderRadius: 10, paddingBottom: 12 }}>
        <View style={{ alignItems: 'center', margin: 8 }}>
          <Text style={{ width: '100%', backgroundColor: '#3bcd6b', padding: 8, alignItems: 'center', textAlign: 'center' }}>COST AND RETURN ANALYSIS {area.toFixed(2)} HA PINEAPPLE PRODUCTION</Text>
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
            <Text styles={{ fontWeight: 'bold' }}>Materials Inputs:</Text>
          </View>
          {
            components.map((component) => {
              if (component.particular.toLowerCase() === 'material') {
                return (
                  <TableData
                    key={component.id}
                    name={component.name}
                    qnty={component.qnty}
                    unit={component.unit}
                    price={component.price}
                    totalPrice={component.totalPrice}
                  />
                )
              }
            })
          }
          <View style={{ ...styles.tableHead, borderTopWidth: 2, borderBottomWidth: 2 }}>
            <View style={{ flex: 4 }}>
              <Text styles={{ fontWeight: 'bold' }}>Total Material Input: </Text>
            </View>
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <Text styles={{ fontWeight: 'bold' }}>
                {materialTotal}
              </Text>
            </View>
          </View>
          <View style={{ ...styles.tableHead }}>
            <Text styles={{ fontWeight: 'bold' }}>Labor Inputs:</Text>
          </View>
          {
            components.map((component) => {
              if (component.particular.toLowerCase() === 'labor') {
                return (
                  <TableData
                    key={component.id}
                    name={component.name}
                    qnty={component.qnty}
                    unit={component.unit}
                    price={component.price}
                    totalPrice={component.totalPrice}
                  />
                )
              }
            })
          }
          <View style={{ ...styles.tableHead, borderTopWidth: 2, borderBottomWidth: 2 }}>
            <View style={{ flex: 4 }}>
              <Text styles={{ fontWeight: 'bold' }}>Total Labor Input: </Text>
            </View>
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <Text styles={{ fontWeight: 'bold' }}>
                {laborTotal}
              </Text>
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
    backgroundColor: '#FAF1CE',
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