import { addDoc, collection, doc, getDoc, updateDoc, query } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import { useCollectionData } from "react-firebase-hooks/firestore";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  TextInput
} from "react-native";
import { db } from '../firebase/Config';
import { AddDataRow } from './AddDataRow';

export const TableBuilder = ({ components, area, setRoiDetails, pineapple }) => {
  const [laborTotal, setLaborTotal] = useState(0)
  const [materialTotal, setMaterialTotal] = useState(0)
  const [costTotal, setCostTotal] = useState(0)
  const [grossReturn, setGrossReturn] = useState(0)
  const [butterBall, setBatterBall] = useState(0)
  const [netReturn, setNetReturn] = useState(0)
  const [roi, setRoi] = useState(0)

  function getPinePrice(pine){
    const newPine = pineapple.filter(thePine => thePine.name.toLowerCase() === pine.toLowerCase())[0]
    return parseInt(newPine.price)
  }

  useEffect(() => {
    let materialSum = 5000;
    let laborSum = 0;

    components.forEach((component) => {
      if (component.particular.toLowerCase() === 'material') {
        if (component.name.toLowerCase() === 'planting materials') {
          const qntyPrice = parseInt(component.qntyPrice)
          setGrossReturn(getPercentage(90, qntyPrice).toFixed());
          setBatterBall(getPercentage(10, qntyPrice).toFixed());
        }
        materialSum += parseInt(component.totalPrice);
      } else if (component.particular.toLowerCase() === 'labor') {
        laborSum += parseInt(component.totalPrice);
      }
    });

    setMaterialTotal(materialSum);
    setLaborTotal(laborSum);
    setCostTotal(materialSum + laborSum);
  }, [components]);

  useEffect(() => {
    const grossReturnAndBatter = (grossReturn*getPinePrice('pineapple')) + (butterBall*getPinePrice('butterball'))
    const netReturnValue = grossReturnAndBatter - costTotal;
    const roiValue = (netReturnValue / grossReturnAndBatter) * 100;
    setNetReturn(netReturnValue);
    setRoi(Math.round(roiValue * 100) / 100);
  }, [grossReturn, butterBall, costTotal]);

  useEffect(() => {
    const roiDetails = {
      laborTotal,
      materialTotal,
      costTotal,
      grossReturn,
      butterBall,
      netReturn,
      roi
    };

    setRoiDetails(roiDetails);
  }, [laborTotal, materialTotal, costTotal, grossReturn, butterBall, netReturn, roi]);

  const getPercentage = (pirsint, nambir) => {
    return (nambir / 100) * pirsint
  }

  const formatter = (num) => {
    return num.toLocaleString('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0
    })
  }

  const TableData = ({ name, qnty, unit, price, totalPrice }) => {
    return (
      <View style={styles.tableData}>
        <View style={{ ...styles.tableHeadLabel3, alignItems: 'flex-start' }}>
          <Text>{name}</Text>
        </View>
        <View style={{ ...styles.tableHeadLabel3, alignItems: 'center' }}>
          <TextInput
            editable
            onChangeText={()=>null}
            placeholder={qnty.toString()}
            value={qnty}
            style={styles.textInput}
          />
          {/* <Text>{qnty.toLocaleString()}</Text> */}
        </View>
        <View style={{ ...styles.tableHeadLabel2, alignItems: 'center' }}>
          <Text>{unit}</Text>
        </View>
        <View style={{ ...styles.tableHeadLabel3, alignItems: 'flex-end' }}>
          <Text>{formatter(price)}</Text>
        </View>
        <View style={{ ...styles.tableHeadLabel3, alignItems: 'flex-end' }}>
          {/* {setTotal(total + totalPrice)} */}
          <Text>{formatter(totalPrice)}</Text>
        </View>
      </View>
    )
  }

  return (
    <>
      <View style={{ ...styles.container, minHeight: 300, borderRadius: 10, paddingBottom: 12, margin:10}}>
        <View style={{ alignItems: 'center', backgroundColor: '#4DAF50', margin: 8, marginBottom: 12, borderRadius: 6, }}>
          <Text style={{ width: '100%', padding: 8, alignItems: 'center', textAlign: 'center', color: '#FFF' }}>COST AND RETURN ANALYSIS {area.toFixed(2)} HA PINEAPPLE PRODUCTION</Text>
        </View>
        <View style={{ flex: 1, marginTop: 6, marginHorizontal: 12 }}>
          {/* Header */}
          <View style={{ ...styles.tableHead, borderBottomWidth: 2, borderColor: '#000', }}>
            <View style={{ ...styles.tableHeadLabel3, alignItems: 'center' }}>
              <Text style={{ fontSize: 12, fontWeight: '600' }}>PARTICULARS</Text>
            </View>
            <View style={{ ...styles.tableHeadLabel3, alignItems: 'center' }}>
              <Text style={{ fontSize: 12 }}>QNTY</Text>
            </View>
            <View style={{ ...styles.tableHeadLabel2, alignItems: 'center' }}>
              <Text style={{ fontSize: 12 }}>UNIT</Text>
            </View>
            <View style={{ ...styles.tableHeadLabel3, alignItems: 'center' }}>
              <Text style={{ fontSize: 12 }}>PRICE/UNIT</Text>
            </View>
            <View style={{ ...styles.tableHeadLabel3, alignItems: 'flex-end' }}>
              <Text style={{ fontSize: 12 }}>TOTAL PRICE</Text>
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
                    qnty={component.qntyPrice}
                    unit={component.unit}
                    price={component.price}
                    totalPrice={component.totalPrice}
                  />
                )
              }
            })
          }
          <View style={styles.tableHead}>
            <View style={{ flex: 4 }}>
              <Text styles={{ fontWeight: 'bold' }}>Land Rental</Text>
            </View>
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <Text styles={{ fontWeight: 'bold' }}>
                {formatter(5000)}
              </Text>
            </View>
          </View>
          <View style={{ ...styles.tableHead, borderTopWidth: 2, borderBottomWidth: 2, marginBottom: 12 }}>
            <View style={{ flex: 4 }}>
              <Text styles={{ fontWeight: 'bold' }}>Total Material Input: </Text>
            </View>
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <Text styles={{ fontWeight: 'bold' }}>
                {formatter(materialTotal)}
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
                    qnty={component.qntyPrice}
                    unit={component.unit}
                    price={component.price}
                    totalPrice={component.totalPrice}
                  />
                )
              }
            })
          }
          <View style={{ ...styles.tableHead, borderTopWidth: 2, borderBottomWidth: 2, marginBottom: 12 }}>
            <View style={{ flex: 4 }}>
              <Text styles={{ fontWeight: 'bold' }}>Total Labor Input: </Text>
            </View>
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <Text styles={{ fontWeight: 'bold' }}>
                {formatter(laborTotal)}
              </Text>
            </View>
          </View>
          <View style={styles.tableHead}>
            <View style={{ flex: 4 }}>
              <Text styles={{ fontWeight: 'bold' }}>Total Cost of Production</Text>
            </View>
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <Text styles={{ fontWeight: 'bold' }}>
                {formatter(costTotal)}
              </Text>
            </View>
          </View>
          <TableData
            name={'Gross Return'}
            qnty={grossReturn}
            unit={'pcs'}
            price={8}
            totalPrice={formatter(grossReturn * 8)}
          />
          <TableData
            name={'Good Butterball'}
            qnty={butterBall}
            unit={'pcs'}
            price={2}
            totalPrice={formatter(butterBall * 2)}
          />
          <View style={styles.tableHead}>
            <View style={{ flex: 4 }}>
              <Text styles={{ fontWeight: 'bold' }}>Net Return</Text>
            </View>
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <Text styles={{ fontWeight: 'bold' }}>
                {formatter(netReturn)}
              </Text>
            </View>
          </View>
          <View style={styles.tableHead}>
            <View style={{ flex: 4 }}>
              <Text styles={{ fontWeight: 'bold' }}>ROI</Text>
            </View>
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <Text styles={{ fontWeight: 'bold' }}>
                {`%${roi.toFixed(2)}`}
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
  textInput: {
    flex: 1,
    height: 42,
    opacity: 1.0,
    borderColor: '#E8E7E7',
    borderWidth: 1,
    backgroundColor: '#FBFBFB',
    borderRadius: 8,
    paddingHorizontal: 12,
    color: '#3C3C3B',
    fontSize: 16,
    width:'100%'
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
  },
  tableHeadLabel2: {
    flex: 1,
    alignSelf: 'stretch'
  },
  tableHeadLabel3: {
    flex: 2,
    alignSelf: 'stretch',
    fontSize: 12
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