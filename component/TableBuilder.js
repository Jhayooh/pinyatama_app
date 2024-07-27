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

export const TableBuilder = ({ components, area, setRoiDetails, pineapple, setComponents }) => {
  const [comps, setComps] = useState(components)
  const [laborTotal, setLaborTotal] = useState(0)
  const [materialTotal, setMaterialTotal] = useState(0)
  const [fertilizerTotal, setFertlizerTotal] = useState(0)
  const [costTotal, setCostTotal] = useState(0)
  const [grossReturn, setGrossReturn] = useState(0)
  const [butterBall, setBatterBall] = useState(0)
  const [netReturn, setNetReturn] = useState(0)
  const [roi, setRoi] = useState(0)
  const [pinePrice, setPinePrice] = useState(0)
  const [butterPrice, setButterPrice] = useState(0)
  const [trial, setTrial] = useState(0)

  function getPinePrice(pine) {
    const newPine = pineapple.filter(thePine => thePine.name.toLowerCase() === pine.toLowerCase())[0]
    return parseInt(newPine.price.toFixed())
  }

  useEffect(() => {
    let materialSum = 0;
    let laborSum = 0;
    let fertilizerSum = 0;

    comps.forEach((component) => {
      if (component.particular.toLowerCase() === 'material') {
        if (component.name.toLowerCase() === 'planting materials') {
          const qntyPrice = parseInt(component.qntyPrice)
          setGrossReturn(getPercentage(90, qntyPrice));
          setBatterBall(getPercentage(10, qntyPrice));
        }
        if (component.parent.toLowerCase() === 'fertilizer') {
          fertilizerSum += parseInt(component.totalPrice)
        }
        materialSum += parseInt(component.totalPrice);
      } else if (component.particular.toLowerCase() === 'labor') {
        laborSum += parseInt(component.totalPrice);
      }
    });

    setMaterialTotal(materialSum);
    setLaborTotal(laborSum);
    setFertlizerTotal(fertilizerSum);
    setCostTotal(materialSum + laborSum);
  }, [comps, pineapple]);

  useEffect(() => {
    const pineapplePrice = getPinePrice('pineapple')
    const butterballPrice = getPinePrice('butterball')
    const grossReturnAndBatter = (grossReturn * pineapplePrice) + (butterBall * butterballPrice)
    const netReturnValue = grossReturnAndBatter - costTotal;
    const roiValue = (netReturnValue / grossReturnAndBatter) * 100;
    setPinePrice(pineapplePrice)
    setButterPrice(butterballPrice)
    setNetReturn(netReturnValue);
    setRoi(Math.round(roiValue * 100) / 100);
  }, [grossReturn, butterBall, costTotal]);

  useEffect(() => {
    const roiDetails = {
      laborTotal,
      materialTotal,
      fertilizerTotal,
      costTotal,
      grossReturn,
      butterBall,
      netReturn,
      roi,
      pinePrice,
      butterPrice
    };

    setComponents(comps)
    setRoiDetails(roiDetails);
  }, [laborTotal, materialTotal, costTotal, grossReturn, butterBall, netReturn, roi, pineapple]);

  const getPercentage = (pirsint, nambir) => {
    return Math.round((nambir / 100) * pirsint)
  }

  const formatter = (num) => {
    return num.toLocaleString('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0
    })
  }

  const TableData = ({ component, editable }) => {
    const [name, setName] = useState(component.name)
    const [qntyPrice, setQntyPrice] = useState(component.qntyPrice)
    const [unit, setUnit] = useState(component.unit)
    const [price, setPrice] = useState(component.price)
    const [totalPrice, setTotalPrice] = useState(component.totalPrice)

    const handleEnter = () => {
      setComps((prev) =>
        prev.map((c) =>
          c.id === component.id ? { ...c, qntyPrice: qntyPrice, totalPrice: qntyPrice * price } : c
        ))
    }

    const handleEdit = (e) => {
      const v = e || 0
      setQntyPrice(v)
      setTotalPrice(v * price)
    }
    return (
      <View style={styles.tableData}>
        <View style={{ ...styles.tableHeadLabel3, alignItems: 'flex-start' }}>
          <Text>{name}</Text>
        </View>
        <View style={{ ...styles.tableHeadLabel3, alignItems: 'center' }}>
          <TextInput
            editable={editable}
            keyboardType='numeric'
            maxLength={3}
            onChangeText={handleEdit}
            onSubmitEditing={handleEnter}
            placeholder={component ? qntyPrice.toString() : ""}
            value={qntyPrice}
            style={editable ? { ...styles.textInput, borderColor: 'orange', borderWidth: 1 } : styles.textInput}
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
      <View style={{ ...styles.container, minHeight: 300, borderRadius: 10, paddingBottom: 12, margin: 10 }}>
        <View style={{ alignItems: 'center', backgroundColor: '#4DAF50', margin: 8, marginBottom: 12, borderRadius: 6, }}>
          <Text style={{ width: '100%', padding: 8, alignItems: 'center', textAlign: 'center', color: '#FFF' }}>
            COST AND RETURN ANALYSIS {typeof area === 'number' ? area.toFixed(2) : area} HA PINEAPPLE PRODUCTION
          </Text>

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
            <Text styles={{ fontWeight: 900, fontSize: '32px' }}>Materials Inputs:</Text>
          </View>
          <View style={{ ...styles.tableHead }}>
            <Text styles={{ fontWeight: 'bold' }}>Fertilizers</Text>
          </View>
          {
            comps?.map((comp) => {
              if (comp.parent.toLowerCase() === 'fertilizer') {
                return (
                  <TableData
                    key={comp.id}
                    component={comp}
                    editable={true}
                  />
                )
              }
            })
          }
          {
            comps?.map((comp) => {
              if (comp.particular.toLowerCase() === 'material' && comp.parent.toLowerCase() !== 'fertilizer') {
                return (
                  <TableData
                    key={comp.id}
                    component={comp}
                    editable={false}
                  />
                )
              }
            })
          }
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
            comps?.map((comp) => {
              if (comp.particular.toLowerCase() === 'labor') {
                return (
                  <TableData
                    key={comp.id}
                    component={comp}
                    editable={false}
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
            component={{
              name: 'Gross Return',
              qntyPrice: grossReturn,
              unit: 'pcs',
              price: pinePrice,
              totalPrice: grossReturn * pinePrice
            }}
            editable={false}
          />
          <TableData
            component={{
              name: 'Good Butterball',
              qntyPrice: butterBall,
              unit: 'pcs',
              price: butterPrice,
              totalPrice: butterBall * butterPrice
            }}
            editable={false}
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
                {`${roi.toFixed(2)} %`}
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
    width: '100%'
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