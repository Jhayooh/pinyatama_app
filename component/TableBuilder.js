import { addDoc, collection, doc, getDoc, updateDoc, query, LoadBundleTask } from 'firebase/firestore';
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
import { Table, Row, Rows } from 'react-native-table-component';
import { Dropdown } from 'react-native-element-dropdown';

export const TableBuilder = ({ components, area, setRoiDetails, pineapple, setComponents, fertilizers, soil, bbType, oneSeven, fourTen }) => {
  const [comps, setComps] = useState(components)
  const [cacheComps, setCacheComps] = useState(null)
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
  const [trial, setTrial] = useState({})

  const [oneSevenData, setOneSevenData] = useState(0)
  const [fourTenData, setFourTenData] = useState(0)
  const [totalOneSeven, setTotalOneSeven] = useState(0)
  const [totalFourTen, setTotalFourTen] = useState(0)
  function getPinePrice(pine) {
    const newPine = pineapple.find(thePine => thePine.name.toLowerCase() === pine.toLowerCase())
    return parseInt(newPine.price.toFixed())
  }

  const getMult = (numOne, numTwo) => {
    const num = numOne * numTwo
    return Math.round(num * 10) / 10
  }

  useEffect(() => {
    if (oneSevenData !== null) {
      const selectedOneSeven = oneSeven.find(item => item.value === oneSevenData);
      if (selectedOneSeven) {
        const totalPrice = selectedOneSeven.data.reduce((sum, item) => {
          return sum + (item.totalPrice || 0) * 2;
        }, 0);

        setTotalOneSeven(totalPrice);
        setComps(prevComps => {
          const filteredComps = prevComps.filter(comp => ![1, 7].includes(comp.label));
          return [
            ...filteredComps,
            ...selectedOneSeven.data.flatMap(item => [
              { ...item, label: 1, type: 'p' },
              { ...item, label: 7, type: 'p' }
            ])
          ];
        });
      }
    }
  }, [oneSevenData]);

  useEffect(() => {
    if (fourTenData !== null) {
      const selectedFourTen = fourTen.find(item => item.value === fourTenData);
      if (selectedFourTen) {
        const totalPrice = selectedFourTen.data.reduce((sum, item) => {
          return sum + (item.totalPrice || 0) * 2;
        }, 0);

        setTotalFourTen(totalPrice);
        setComps(prevComps => {
          const filteredComps = prevComps.filter(comp => ![4, 10].includes(comp.label));
          return [
            ...filteredComps,
            ...selectedFourTen.data.flatMap(item => [
              { ...item, label: 4, type: 'p' },
              { ...item, label: 10, type: 'p' }
            ])
          ];
        });
      }
    }
  }, [fourTenData]);


  useEffect(() => {
    let materialSum = 0;
    let laborSum = 0;
    let fertilizerSum = 0;

    const loam = 90;
    const sandy = 85;
    const clay = 80;

    // const oneAndSevenFerts = oneSeven.find(v => v.value === oneSevenData);
    // const fourAndTenFerts = fourTen.find(v => v.value === fourTenData);

    // const totalOneSevenPrice = oneAndSevenFerts.data.reduce((sum, comp) => {
    //   return sum + comp.totalPrice;
    // }, 0);

    // const totalFourTenPrice = fourAndTenFerts.data.reduce((sum, comp) => {
    //   return sum + comp.totalPrice;
    // }, 0);

    // fertilizerSum = totalOneSevenPrice + totalFourTenPrice


    comps.forEach((component) => {
      if (component.particular.toLowerCase() === 'material') {
        if (component.name.toLowerCase() === 'planting materials') {
          const qntyPrice = parseInt(component.qntyPrice)
          switch (soil.toLowerCase()) {
            case 'loam':
              setGrossReturn(getPercentage(loam, qntyPrice));
              setBatterBall(getPercentage(100 - loam, qntyPrice));
              break

            case 'clay':
              setGrossReturn(getPercentage(clay, qntyPrice));
              setBatterBall(getPercentage(100 - clay, qntyPrice));
              break

            case 'sandy':
              setGrossReturn(getPercentage(sandy, qntyPrice));
              setBatterBall(getPercentage(100 - sandy, qntyPrice));
              break

            default:
              setGrossReturn(90, qntyPrice)
              setBatterBall(10, qntyPrice)
              break;
          }

        }

        if (component.parent.toLowerCase() === 'fertilizer') {
          fertilizerSum += parseFloat(component.totalPrice)
        }

        materialSum += parseInt(component.totalPrice);
      } else if (component.particular.toLowerCase() === 'labor') {
        laborSum += parseFloat(component.totalPrice);
      }
    });

    setMaterialTotal(materialSum - fertilizerSum);
    setLaborTotal(laborSum);
    setFertlizerTotal(fertilizerSum);
    setCostTotal(materialSum + laborSum);
  }, [comps, pineapple, fourTenData, oneSevenData]);

  useEffect(() => {
    const pineapplePrice = getPinePrice('good size')
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

  const currencyformatter = (num) => {
    return num.toLocaleString('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }

  const tableHead = ['Particulars', 'Quantity', 'Unit', 'Price/Unit (₱)', 'Total Price (₱)'];

  const TableData = ({ component, editable, st }) => {
    const [name, setName] = useState(component.name);
    const [qntyPrice, setQntyPrice] = useState(component.qntyPrice);
    const [unit, setUnit] = useState(component.unit);
    const [price, setPrice] = useState(component.price);
    const [totalPrice, setTotalPrice] = useState(component.totalPrice);

    const handleEnter = () => {
      setTotalPrice(qntyPrice * price);
      const newComp = {
        ...component,
        name,
        qntyPrice: qntyPrice,
        unit,
        price,
        totalPrice: qntyPrice * price
      }
      setComps((prevComps) =>
        prevComps.map((comp) => {
          if (component.parent.toLowerCase() === 'fertilizer' && comp.foreignId === component.foreignId && comp.label === component.label) {

            return newComp;
          }
          if (comp.id === component.id) {
            return newComp;
          }
          return comp;
        })
      );
    };

    const handleEdit = (value) => {
      if (value === "") {
        value = "0"
      }
      if (value.startsWith(".")) {
        value = "0" + value;
      }
      if (/^\d*\.?\d*$/.test(value)) {
        setQntyPrice(value);
      }
      setTotalPrice('Press Enter');
    };
    const tableData = [
      [
        <Text style={{ fontSize: 12, fontWeight: 600 }}>{name}</Text>,
        <TextInput
          editable={editable}
          keyboardType="decimal-pad"
          // maxLength={3}
          onChangeText={handleEdit}
          onSubmitEditing={handleEnter}
          placeholder={formatter(qntyPrice).toString()}
          value={formatter(qntyPrice).toString()}
          style={editable ? styles.textInputEditable : styles.textInput}
        />,
        <Text style={{ fontSize: 12, fontWeight: 600 }}>{unit}</Text>,
        <Text style={{ fontSize: 12, fontWeight: 600, textAlign: 'right' }}>{formatter(price)}</Text>,
        <Text style={{ fontSize: 12, fontWeight: 600, textAlign: 'right' }}>{formatter(totalPrice)}</Text>,
      ]
    ];

    return (
      <View style={styles.tableHeadLabel3}>
        <Table borderStyle={{ borderWidth: .5, borderColor: 'grey', opacity: 0.1 }}>
          {/* <Row data={tableHead} style={styles.head} textStyle={styles.text} /> */}
          <Rows data={tableData} textStyle={{ textAlign: 'right', padding: 3 }} />
        </Table>
      </View>
    );
  };

  const formatter = (num) => {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <>
      <View style={{ ...styles.container, minHeight: 300, borderRadius: 10, paddingBottom: 12, marginTop: 2 }}>
        <View style={{ alignItems: 'center', backgroundColor: '#4DAF50', margin: 8, marginBottom: 12, borderRadius: 6, }}>
          <Text style={{ width: '100%', padding: 8, alignItems: 'center', textAlign: 'center', color: '#FFF' }}>
            COST AND RETURN ANALYSIS {typeof area === 'number' ? area.toFixed(2) : area} HA PINEAPPLE PRODUCTION
          </Text>
        </View>
        <View style={{ flex: 1, marginTop: 6, marginHorizontal: 12 }}>
          {/* Header */}
          <View style={{ ...styles.tableHead, borderBottomWidth: 2, borderColor: '#000', }}>
            <View style={{ ...styles.tableHeadLabel3, alignItems: 'center' }}>
              <Row data={tableHead} style={{ justifyContent: 'center' }}
                textStyle={{ textAlign: 'center', fontWeight: 'bold' }} />
            </View>
          </View>

          {/* Body */}
          <View style={{ ...styles.tableHead }}>
            <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'red' }}>Fertilizers</Text>
          </View>

          <View style={{ ...styles.tableHead, marginTop: 12 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Apply during the 1st and 7th month</Text>
          </View>

          <View style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
            <Dropdown
              data={oneSeven}
              labelField='option'
              valueField='value'
              value={oneSevenData}
              onChange={(item) => {
                console.log("iteeeem oneSeven", item.data)
                setOneSevenData(item.value);
              }}
              style={{ ...styles.textInput, borderBottomRightRadius: 0, borderTopRightRadius: 0 }}
            />
          </View>

          {
            oneSeven
              .find(d => d.value === oneSevenData)
              .data?.map((comp) => {
                return (
                  <TableData
                    key={comp.option}
                    component={{ ...comp }}
                    editable={true}
                  />
                )
              })
          }
          <View style={{ ...styles.tableHead, borderTopWidth: 2, borderBottomWidth: 2, marginBottom: 12 }}>
            <View style={{ flex: 3 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'red' }}>Total: </Text>
            </View>
            <View style={{ flex: 2, alignItems: 'flex-end' }}>
              <Text style={{ fontWeight: 'bold', fontSize: 18, color: 'red' }}>
                {currencyformatter(totalOneSeven)}
              </Text>
            </View>
          </View>
          <View style={{ ...styles.tableHead, marginTop: 12 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Apply during the 4th and 10th month</Text>
          </View>

          <View style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
            <Dropdown
              data={fourTen}
              labelField='option'
              valueField='value'
              placeholder='Select fertilizers'
              value={fourTenData}
              onChange={(item) => {
                console.log("iteeeem fourTen", item.data)
                setFourTenData(item.value);
              }}
              style={{ ...styles.textInput, borderBottomRightRadius: 0, borderTopRightRadius: 0 }}
            />
          </View>

          {
            fourTen
              .find(d => d.value === fourTenData)
              .data?.map((comp) => {
                return (
                  <TableData
                    key={comp.option}
                    component={{ ...comp }}
                    editable={true}
                  />
                )
              })
          }

          <View style={{ ...styles.tableHead, borderTopWidth: 2, borderBottomWidth: 2, marginBottom: 12 }}>
            <View style={{ flex: 3 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'red' }}>Total: </Text>
            </View>
            <View style={{ flex: 2, alignItems: 'flex-end' }}>
              <Text style={{ fontWeight: 'bold', fontSize: 18, color: 'red' }}>
                {currencyformatter(totalFourTen)}
              </Text>
            </View>
          </View>

          <View style={{ ...styles.tableHead, borderTopWidth: 2, borderBottomWidth: 2, marginBottom: 12 }}>
            <View style={{ flex: 3 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'red' }}>Total Fertilizer Input: </Text>
            </View>
            <View style={{ flex: 2, alignItems: 'flex-end' }}>
              <Text style={{ fontWeight: 'bold', fontSize: 18, color: 'red' }}>
                {currencyformatter(fertilizerTotal)}
              </Text>
            </View>
          </View>
          <View style={{ ...styles.tableHead }}>
            <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'red' }}>Materials:</Text>
          </View>

          {
            comps?.map((comp) => {
              if (comp.particular.toLowerCase() === 'material' && comp.parent.toLowerCase() !== 'fertilizer') {
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
          <View style={{ ...styles.tableHead, borderTopWidth: 2, borderBottomWidth: 2, marginBottom: 12 }}>
            <View style={{ flex: 3 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'red' }}>Total Material Input: </Text>
            </View>
            <View style={{ flex: 2, alignItems: 'flex-end' }}>
              <Text style={{ fontWeight: 'bold', fontSize: 18, color: 'red' }}>
                {currencyformatter(materialTotal)}
              </Text>
            </View>
          </View>
          <View style={{ ...styles.tableHead }}>
            <Text style={{ fontWeight: 'bold', fontSize: 18, color: 'red' }}>Labor:</Text>
          </View>
          {
            comps?.map((comp) => {
              if (comp.particular.toLowerCase() === 'labor') {
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
          <View style={{ ...styles.tableHead, borderTopWidth: 2, borderBottomWidth: 2, marginBottom: 12 }}>
            <View style={{ flex: 3 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'red' }}>Total Labor Input: </Text>
            </View>
            <View style={{ flex: 2, alignItems: 'flex-end' }}>
              <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'red' }}>
                {currencyformatter(laborTotal)}
              </Text>
            </View>
          </View>
          <View style={styles.tableHead}>
            <View style={{ flex: 3 }}>
              <Text style={{ fontWeight: 'bold', color: 'red', fontSize: 20, }}>Total Cost of Production</Text>
            </View>
            <View style={{ flex: 2, alignItems: 'flex-end' }}>
              <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'red' }}>
                {currencyformatter(costTotal)}
              </Text>
            </View>
          </View>
          <View style={{ ...styles.tableHead, borderBottomWidth: 2, borderColor: '#000', marginTop: 10, }}>
            <View style={{ ...styles.tableHeadLabel3, alignItems: 'center' }}>
              <Row data={tableHead} style={{ justifyContent: 'center' }}
                textStyle={{ textAlign: 'center', fontWeight: 'bold' }} />
            </View>
          </View>
          <TableData
            component={{
              name: 'Good Size',
              qntyPrice: grossReturn,
              unit: 'pcs',
              price: pinePrice,
              totalPrice: grossReturn * pinePrice
            }}
            editable={false}
          />
          <TableData
            component={{
              name: 'Batterball',
              qntyPrice: butterBall,
              unit: 'pcs',
              price: butterPrice,
              totalPrice: butterBall * butterPrice
            }}
            editable={false}

          />
          <View style={styles.tableHead}>
            <View style={{ flex: 3 }}>
              <Text style={{ fontWeight: 'bold', color: 'red', fontSize: 20 }}>Net Return</Text>
            </View>
            <View style={{ flex: 2, alignItems: 'flex-end' }}>
              <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'red' }}>
                {currencyformatter(netReturn)}
              </Text>
            </View>
          </View>
          <View style={styles.tableHead}>
            <View style={{ flex: 3 }}>
              <Text style={{ fontWeight: 'bold', color: 'red', fontSize: 20 }}>ROI</Text>
            </View>
            <View style={{ flex: 2, alignItems: 'flex-end' }}>
              <Text style={{ fontWeight: 'bold', color: 'red', fontSize: 20 }}>
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
    //backgroundColor: '#FAF1CE',
  },
  image: {
    flex: 1,
    opacity: .8,
    paddingVertical: 36,
    paddingHorizontal: 12,
  },
  textInputEditable: {
    flex: 1,
    width: '100%',
    color: 'black',
    opacity: 1.0,
    backgroundColor: '#FFF',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    height: 10,
    borderColor: '#E8E7E7',
    borderWidth: 1,
    textAlign: 'right',
    paddingHorizontal: 12,
    fontSize: 12,
  },

  textInput: {
    flex: 1,
    height: 10,
    opacity: .9,

    paddingHorizontal: 12,
    color: 'black',
    fontSize: 14,
    width: '100%',
    textAlign: 'center',


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
  },
  tableHeadLabel2: {
    flex: 1,
    alignSelf: 'stretch'
  },
  tableHeadLabel3: {
    flex: 2,
    alignSelf: 'stretch',
    fontSize: 30,
    textAlign: 'center'
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
  textInput: {
    flex: 1,
    height: 46,
    opacity: 1.0,
    borderColor: '#E8E7E7',
    borderWidth: 1,
    backgroundColor: '#FBFBFB',
    borderRadius: 8,
    paddingHorizontal: 18,
    color: '#3C3C3B',
    fontSize: 16,
  },
})