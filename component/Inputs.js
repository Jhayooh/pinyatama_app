import React, { useState } from 'react';
import {
    ImageBackground,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';



const Inputs = () => {
    const [data, setData] = useState([]);
    const [selectedParticulars, setSelectedParticulars] = useState('');
    const [quantity, setQuantity] = useState('');
    const [unit, setUnit] = useState('');
    const [price, setPrice] = useState('');
    const [totalPrice, setTotalPrice] = useState('');

    const handleQuantityChange = (text) => {
        setQuantity(text);
    };

    const handleUnitChange = (text) => {
        setUnit(text);
    };

    const handlePriceChange = (text) => {
        setPrice(text);
    };

    const handleTotalPriceChange = (text) => {
        setTotalPrice(text);
    };

    return (
        <>
            <View style={styles.container}>
                <ImageBackground source={require('../assets/brakrawnd.png')} resizeMode="cover" style={styles.image}>
                    <Text style={styles.title}>Pangalan ng Bukid</Text>
                    <Text style={styles.location}>Daet, Camarines Norte</Text>
                    <View style={styles.labelContainer}>
                        <Text style={styles.label}>Pagsusuri ng Paggastos at Pagbabalik sa Produksiyon ng Pinya</Text>

                        <View style={styles.tableRow1}>
                            <View style={styles.columnHeaderWrapper}>
                                <Text style={styles.columnHeaderText}>Particulars</Text>
                            </View>
                            <View style={styles.columnHeaderWrapper}>
                                <Text style={styles.columnHeaderText}>Quantity</Text>
                            </View>
                            <View style={styles.columnHeaderWrapper}>
                                <Text style={styles.columnHeaderText}>Unit</Text>
                            </View>
                            <View style={styles.columnHeaderWrapper}>
                                <Text style={styles.columnHeaderText}>Price</Text>
                            </View>
                            <View style={styles.columnHeaderWrapper}>
                                <Text style={styles.columnHeaderText}>Total Price</Text>
                            </View>
                        </View>
                        <ScrollView showsVerticalScrollIndicator={false}>

                            <Text style={{ fontSize: 15, fontWeight: 'bold', fontFamily: 'serif', marginLeft: 2 }}> Material Inputs</Text>
                            <View style={styles.tableRow}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Planting Materials"
                                    onChangeText={setSelectedParticulars}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="25,000"
                                    keyboardType="numeric"
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="pcs"
                                    onChangeText={handleUnitChange}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="1"
                                    onChangeText={handlePriceChange}
                                    keyboardType="numeric"
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="25,000"
                                    onChangeText={handleTotalPriceChange}
                                    keyboardType="numeric"
                                />
                            </View>
                            <View style={styles.tableRow}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="0-060"
                                    onChangeText={setSelectedParticulars}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="5"
                                    onChangeText={handleQuantityChange}
                                    keyboardType="numeric"
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="bags"

                                    onChangeText={handleUnitChange}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="21,820"
                                    onChangeText={handlePriceChange}
                                    keyboardType="numeric"
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="9,100"
                                    onChangeText={handleTotalPriceChange}
                                    keyboardType="numeric"
                                />
                            </View>
                            <View style={styles.tableRow}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Urea"
                                    onChangeText={setSelectedParticulars}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="5"
                                    onChangeText={handleQuantityChange}
                                    keyboardType="numeric"
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="bags"
                                    onChangeText={handleUnitChange}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="2,710"
                                    onChangeText={handlePriceChange}
                                    keyboardType="numeric"
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="13,550"
                                    onChangeText={handleTotalPriceChange}
                                    keyboardType="numeric"
                                />
                            </View>
                            <View style={styles.tableRow}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Diuron (2X)"
                                    onChangeText={setSelectedParticulars}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="2"
                                    keyboardType="numeric"
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="kilos"
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="750"
                                    onChangeText={handlePriceChange}
                                    keyboardType="numeric"
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="1,500"
                                    keyboardType="numeric"
                                />
                            </View>
                            <View style={styles.tableRow}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Sticker"
                                    onChangeText={setSelectedParticulars}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="1"
                                    keyboardType="numeric"
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="liter"
                                    onChangeText={handleUnitChange}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="450"
                                    onChangeText={handlePriceChange}
                                    keyboardType="numeric"
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="450"
                                    onChangeText={handleTotalPriceChange}
                                    keyboardType="numeric"
                                />
                            </View>
                            <View style={styles.tableRow}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Flower inducer (ethrel)"
                                    onChangeText={setSelectedParticulars}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="0.5"
                                    keyboardType="numeric"
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="liter"
                                    onChangeText={handleUnitChange}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="920"

                                    onChangeText={handlePriceChange}
                                    keyboardType="numeric"
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="460"
                                    onChangeText={handleTotalPriceChange}
                                    keyboardType="numeric"
                                />
                            </View>
                            <View style={styles.tableRow}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Urea"

                                    onChangeText={setSelectedParticulars}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="21"
                                    onChangeText={handleQuantityChange}
                                    keyboardType="numeric"
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="kilos"
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="60"
                                    onChangeText={handlePriceChange}
                                    keyboardType="numeric"
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="1,260"

                                    onChangeText={handleTotalPriceChange}
                                    keyboardType="numeric"
                                />

                            </View>
                            <View style={styles.tableRow}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Land Rental"
                                    onChangeText={setSelectedParticulars}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="5,000"
                                    onChangeText={handleTotalPriceChange}
                                    keyboardType="numeric"
                                />
                            </View>
                            <View style={styles.tableRow}>
                                <Text style={{ fontSize: 15, fontWeight: 'bold', fontFamily: 'serif', marginLeft: 2 }}> Total Material Input</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="56,320"
                                    keyboardType="numeric"
                                />
                            </View>
                            {/* Labor Input */}
                            <Text style={{ fontSize: 15, fontWeight: 'bold', fontFamily: 'serif', marginLeft: 2 }}> Labor</Text>
                            <View style={styles.tableRow}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Land Clearing"
                                    onChangeText={setSelectedParticulars}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="15"
                                    keyboardType="numeric"
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="MD"
                                    onChangeText={handleUnitChange}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="350"
                                    onChangeText={handlePriceChange}
                                    keyboardType="numeric"
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="5,250"
                                    onChangeText={handleTotalPriceChange}
                                    keyboardType="numeric"
                                />
                            </View>
                            <View style={styles.tableRow}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Plowing"
                                    onChangeText={setSelectedParticulars}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="10"
                                    onChangeText={handleQuantityChange}
                                    keyboardType="numeric"
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="MAD"

                                    onChangeText={handleUnitChange}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="350"
                                    onChangeText={handlePriceChange}
                                    keyboardType="numeric"
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="3,500"
                                    onChangeText={handleTotalPriceChange}
                                    keyboardType="numeric"
                                />
                            </View>
                            <View style={styles.tableRow}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Harrowing"
                                    onChangeText={setSelectedParticulars}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="4"
                                    onChangeText={handleQuantityChange}
                                    keyboardType="numeric"
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="MAD"
                                    onChangeText={handleUnitChange}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="350"
                                    onChangeText={handlePriceChange}
                                    keyboardType="numeric"
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="1,400"
                                    onChangeText={handleTotalPriceChange}
                                    keyboardType="numeric"
                                />
                            </View>
                            <View style={styles.tableRow}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Planting"
                                    onChangeText={setSelectedParticulars}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="15"
                                    keyboardType="numeric"
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="MD"
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="350"
                                    onChangeText={handlePriceChange}
                                    keyboardType="numeric"
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="5,250"
                                    keyboardType="numeric"
                                />
                            </View>
                            <View style={styles.tableRow}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Fertilizer Application"
                                    onChangeText={setSelectedParticulars}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="4"
                                    keyboardType="numeric"
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="MD"
                                    onChangeText={handleUnitChange}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="350"
                                    onChangeText={handlePriceChange}
                                    keyboardType="numeric"
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="1,400"
                                    onChangeText={handleTotalPriceChange}
                                    keyboardType="numeric"
                                />
                            </View>
                            <View style={styles.tableRow}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Spraying"
                                    onChangeText={setSelectedParticulars}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="8"
                                    keyboardType="numeric"
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="MD"
                                    onChangeText={handleUnitChange}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="400"

                                    onChangeText={handlePriceChange}
                                    keyboardType="numeric"
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="3,200"
                                    onChangeText={handleTotalPriceChange}
                                    keyboardType="numeric"
                                />
                            </View>
                            <View style={styles.tableRow}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Flower Induction"
                                    onChangeText={setSelectedParticulars}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="4"
                                    onChangeText={handleQuantityChange}
                                    keyboardType="numeric"
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="MD"
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="400"
                                    onChangeText={handlePriceChange}
                                    keyboardType="numeric"
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="1,600"
                                    onChangeText={handleTotalPriceChange}
                                    keyboardType="numeric"
                                />
                            </View>
                            <View style={styles.tableRow}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Harvesting"
                                    onChangeText={setSelectedParticulars}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="15"
                                    onChangeText={handleTotalPriceChange}
                                    keyboardType="numeric"
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="MD"
                                    onChangeText={setSelectedParticulars}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="350"
                                    onChangeText={handleTotalPriceChange}
                                    keyboardType="numeric"
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="5,250"
                                    onChangeText={handleTotalPriceChange}
                                    keyboardType="numeric"
                                />
                            </View>
                            <View style={styles.tableRow}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Hauling"
                                    onChangeText={setSelectedParticulars}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="15"
                                    onChangeText={handleTotalPriceChange}
                                    keyboardType="numeric"
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="MD"
                                    onChangeText={setSelectedParticulars}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="350"
                                    onChangeText={handleTotalPriceChange}
                                    keyboardType="numeric"
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="5,250"
                                    onChangeText={handleTotalPriceChange}
                                    keyboardType="numeric"
                                />
                            </View>
                            <View style={styles.tableRow}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Cleaning/Sorting"
                                    onChangeText={setSelectedParticulars}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="10"
                                    onChangeText={handleTotalPriceChange}
                                    keyboardType="numeric"
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="MD"
                                    onChangeText={setSelectedParticulars}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="350"
                                    onChangeText={handleTotalPriceChange}
                                    keyboardType="numeric"
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="3,500"
                                    onChangeText={handleTotalPriceChange}
                                    keyboardType="numeric"
                                />
                            </View>
                            <View style={styles.tableRow}>
                                <Text style={{ fontSize: 15, fontWeight: 'bold', fontFamily: 'serif', marginLeft: 2 }}> Total Material Input</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="56,320"
                                    keyboardType="numeric"
                                />

                            </View>
                        </ScrollView>
                    </View>

                </ImageBackground>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignContent: ' center'
    },
    image: {
        flex: 1,
        padding: 12,

    },
    title: {
        marginTop: 20,
        fontSize: 32,
        color: '#fff',
        fontWeight: '700',
    },
    location: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '700',
    },
    labelContainer: {
        backgroundColor: "#E3E55A",
        marginTop: 10,
        padding: 2,
    },
    label: {
        fontSize: 14,
        paddingVertical: 8,
        paddingHorizontal: 2,
        fontWeight: 'bold',
        fontFamily: 'serif',
        padding: 5,
        backgroundColor: '#72bf6a'
    },
    tableRow1: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,

    },
    tableRow: {
        flex:1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,

    },
    columnHeaderWrapper: {
        flex: 1,
        borderBottomWidth: 1,
        borderBottomColor: 'black',
    },
    columnHeaderText: {
        marginTop: 10,
        marginBottom: 5, fontSize: 12,
        fontWeight: 'bold',
        color: 'black',
        textAlign: 'center',
        paddingHorizontal: 5,
        textTransform: 'uppercase',
        justifyContent: 'center'
    },

    input: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
        backgroundColor: 'white',
        marginLeft: 4,
        fontSize: 15
    },
    addButton: {
        backgroundColor: '#206830',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 10,
        alignSelf: 'center',
    },
    addButtonLabel: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default Inputs;
