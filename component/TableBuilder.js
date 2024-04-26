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

export const TableBuilder = ({ components, area, setRoiDetails }) => {
  const [laborTotal, setLaborTotal] = useState(0)
  const [materialTotal, setMaterialTotal] = useState(0)
  const [costTotal, setCostTotal] = useState(0)
  const [grossReturn, setGrossReturn] = useState(0)
  const [batterBall, setBatterBall] = useState(0)
  const [netReturn, setNetReturn] = useState(0)
  const [roi, setRoi] = useState(0)

  useEffect(() => {
    let materialSum = 5000;
    let laborSum = 0;

    components.forEach((component) => {
      if (component.particular.toLowerCase() === 'material') {
        if (component.name.toLowerCase() === 'planting materials') {
          const qntyPrice = parseInt(component.qntyPrice)
          setGrossReturn(getPercentage(90, qntyPrice)*8);
          setBatterBall(getPercentage(10, qntyPrice)*2);
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
    const grossReturnAndBatter = grossReturn + batterBall
    const netReturnValue = grossReturnAndBatter - costTotal;
    const roiValue = (netReturnValue / grossReturnAndBatter) * 100;
    setNetReturn(netReturnValue);
    setRoi(roiValue);
  }, [grossReturn, batterBall, costTotal]);

  useEffect(() => {
    const roiDetails = {
      laborTotal,
      materialTotal,
      costTotal,
      grossReturn,
      batterBall,
      netReturn,
      roi
    };
  
    setRoiDetails(roiDetails);
  }, [laborTotal, materialTotal, costTotal, grossReturn, batterBall, netReturn, roi]);

  const getPercentage = (pirsint, nambir) => {
    return (pirsint / 100) * nambir
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
        <View style={{ ...styles.tableHeadLabel2, alignItems: 'center' }}>
          <Text>{qnty.toLocaleString()}</Text>
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
            <View style={{ ...styles.tableHeadLabel3, alignItems: 'center' }}>
              <Text>PRICE/UNIT</Text>
            </View>
            <View style={{ ...styles.tableHeadLabel3, alignItems: 'flex-end' }}>
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
            qnty={batterBall}
            unit={'pcs'}
            price={2}
            totalPrice={formatter(batterBall * 2)}
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