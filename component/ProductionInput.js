import React from 'react'
import { 
    View,
    Text,
    ScrollView,
    StyleSheet,
    ImageBackground
 } from "react-native";

const sampleHeader = [
  "materials",
  "qnty",
  "unit",
  "price",
  "total price"
]

const SampleData = [
  {
    name: 'Planting Materials',
    qnty: '25, 000',
    unit: 'pcs',
    pUnit: '1',
    total: '25, 000',
    id: 0,
    child: null
  },
  {
    name: 'Fertilizer',
    qnty: '10',
    unit: 'bags',
    pUnit: '1, 150',
    total: '11, 500',
    id: 1,
    child: [
      {
        name: '0-0-60',
        qnty: '5',
        unit: 'bags',
        pUnit: 875,
        total: 4375,
        id: 0
      },
      {
        name: 'Urea',
        qnty: '5',
        unit: 'bags',
        pUnit: 950,
        total: 4750,
        id: 1
      }
    ]
  }
]



const TableHead = ({ headers }) => {
  return (
    <View style={styles.tableHead}>
      {headers.forE}
      <View style={{ flex: 3, alignSelf: 'stretch' }}>
        <Text>{headers[0]}</Text>
      </View>
      <View style={{ flex: 2, alignSelf: 'stretch' }}>
        <Text>{headers[1]}</Text>
      </View>
      <View style={{ flex: 2, alignSelf: 'stretch' }} >
        <Text>{headers[2]}</Text>
      </View>
      <View style={{ flex: 2, alignSelf: 'stretch' }} >
        <Text>{headers[3]}</Text>
      </View>
      <View style={{ flex: 2, alignSelf: 'stretch' }} >
        <Text>{headers[4]}</Text>
      </View>
    </View>
  )
}

const TableData = ({ data }) => {
  return (
    <View style={styles.tableData}>
      <View style={{ flex: 3, alignSelf: 'stretch' }}>
        <Text>{data.name}</Text>
      </View>
      <View style={{ flex: 2, alignSelf: 'stretch' }}>
        <Text>{data.qnty}</Text>
      </View>
      <View style={{ flex: 2, alignSelf: 'stretch' }}>
        <Text>{data.unit}</Text>
      </View>
      <View style={{ flex: 2, alignSelf: 'stretch' }}>
        <Text >{data.pUnit}</Text>
      </View>
      <View style={{ flex: 2, alignSelf: 'stretch' }}>
        <Text>{data.total}</Text>
      </View>
    </View>
  )
}

const TableBuilder = ({headers, items}) => {
  return (
    <>
    <TableHead headers={headers}/>
    {items.map(data => (
      <>
      <TableData data={data}/>
      {data.child && data.child.map(child => (
        <TableData data={child} />
      ))}
      </>
      ))}
    </>
  )
}

const ProductionInput = () => {

  return (
    <View style={styles.container}> 
      <ImageBackground source={require('../assets/brakrawnd.png')} resizeMode="cover" style={styles.image}>
        <Text style={styles.name}>Pangalan ng Bukid</Text>
        <Text style={styles.loc}>Daet, Camarines Norte</Text>
        <Text style={styles.label}>Pagsusuri ng Paggastos at Pagbabalik sa Produksiyon ng Pinya</Text>
        {/* Table Container */}
        <ScrollView style={styles.scrollView}>
          <Text style={styles.texts}>PARTICULAR</Text>
          {/* Table Heads */}
          <TableBuilder headers={sampleHeader} items={SampleData} />
        </ScrollView>
      </ImageBackground>
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
    flex: 1
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
  }
})

export default ProductionInput