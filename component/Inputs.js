import React, { useState } from 'react';
import {
    ImageBackground,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
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

    const handleAddRow = () => {
        const newRow = { selectedParticulars, quantity, unit, price, totalPrice };
        setData([...data, newRow]);
        // Clear input fields after adding row
        setSelectedParticulars('');
        setQuantity('');
        setUnit('');
        setPrice('');
        setTotalPrice('');
    };

    return (
        <View style={styles.container}>
            <ImageBackground source={require('../assets/brakrawnd.png')} resizeMode="cover" style={styles.image}>
                <Text style={styles.title}>Pangalan ng Bukid</Text>
                <Text style={styles.location}>Daet, Camarines Norte</Text>
                <View style={styles.labelContainer}>
                    <Text style={styles.label}>Pagsusuri ng Paggastos at Pagbabalik sa Produksiyon ng Pinya</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={styles.columnHeader}>Particulars</Text>
                    <Text style={styles.columnHeader}>Quantity</Text>
                    <Text style={styles.columnHeader}>Unit</Text>
                    <Text style={styles.columnHeader}>Price</Text>
                    <Text style={styles.columnHeader}>Total Price</Text>
                </View>
                <View style={styles.tableRow}>
                    <TextInput
                        style={styles.input}
                        placeholder="Planting Materials"
                        value={selectedParticulars}
                        onChangeText={setSelectedParticulars}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="25,000"
                        value={quantity}
                        onChangeText={handleQuantityChange}
                        keyboardType="numeric"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="pcs"
                        value={unit}
                        onChangeText={handleUnitChange}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="1"
                        value={price}
                        onChangeText={handlePriceChange}
                        keyboardType="numeric"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="25,000"
                        value={totalPrice}
                        onChangeText={handleTotalPriceChange}
                        keyboardType="numeric"
                    />
                </View>
                <View style={styles.tableRow}>
                    <TextInput
                        style={styles.input}
                        placeholder="0-060"
                        value={selectedParticulars}
                        onChangeText={setSelectedParticulars}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="5"
                        value={quantity}
                        onChangeText={handleQuantityChange}
                        keyboardType="numeric"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="bags"
                        value={unit}
                        onChangeText={handleUnitChange}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="21,820"
                        value={price}
                        onChangeText={handlePriceChange}
                        keyboardType="numeric"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="9,100"
                        value={totalPrice}
                        onChangeText={handleTotalPriceChange}
                        keyboardType="numeric"
                    />
                </View>
                <View style={styles.tableRow}>
                    <TextInput
                        style={styles.input}
                        placeholder="Urea"
                        value={selectedParticulars}
                        onChangeText={setSelectedParticulars}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="5"
                        value={quantity}
                        onChangeText={handleQuantityChange}
                        keyboardType="numeric"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="bags"
                        value={unit}
                        onChangeText={handleUnitChange}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="2,710"
                        value={price}
                        onChangeText={handlePriceChange}
                        keyboardType="numeric"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="13,550"
                        value={totalPrice}
                        onChangeText={handleTotalPriceChange}
                        keyboardType="numeric"
                    />
                </View>
                <View style={styles.tableRow}>
                    <TextInput
                        style={styles.input}
                        placeholder="Diuron (2X)"
                        value={selectedParticulars}
                        onChangeText={setSelectedParticulars}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="2"
                        value={quantity}
                        onChangeText={handleQuantityChange}
                        keyboardType="numeric"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="kilos"
                        value={unit}
                        onChangeText={handleUnitChange}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="750"
                        value={price}
                        onChangeText={handlePriceChange}
                        keyboardType="numeric"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="1,500"
                        value={totalPrice}
                        onChangeText={handleTotalPriceChange}
                        keyboardType="numeric"
                    />
                </View>
                <View style={styles.tableRow}>
                    <TextInput
                        style={styles.input}
                        placeholder="Sticker"
                        value={selectedParticulars}
                        onChangeText={setSelectedParticulars}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="1"
                        value={quantity}
                        onChangeText={handleQuantityChange}
                        keyboardType="numeric"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="liter"
                        value={unit}
                        onChangeText={handleUnitChange}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="450"
                        value={price}
                        onChangeText={handlePriceChange}
                        keyboardType="numeric"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="450"
                        value={totalPrice}
                        onChangeText={handleTotalPriceChange}
                        keyboardType="numeric"
                    />
                </View>
                <View style={styles.tableRow}>
                    <TextInput
                        style={styles.input}
                        placeholder="Flower inducer (ethrel)"
                        value={selectedParticulars}
                        onChangeText={setSelectedParticulars}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="0.5"
                        value={quantity}
                        onChangeText={handleQuantityChange}
                        keyboardType="numeric"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="liter"
                        value={unit}
                        onChangeText={handleUnitChange}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="920"
                        value={price}
                        onChangeText={handlePriceChange}
                        keyboardType="numeric"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="460"
                        value={totalPrice}
                        onChangeText={handleTotalPriceChange}
                        keyboardType="numeric"
                    />
                </View>
                <View style={styles.tableRow}>
                    <TextInput
                        style={styles.input}
                        placeholder="Urea"
                        value={selectedParticulars}
                        onChangeText={setSelectedParticulars}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="21"
                        value={quantity}
                        onChangeText={handleQuantityChange}
                        keyboardType="numeric"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="kilos"
                        value={unit}
                        onChangeText={handleUnitChange}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="60"
                        value={price}
                        onChangeText={handlePriceChange}
                        keyboardType="numeric"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="1,260"
                        value={totalPrice}
                        onChangeText={handleTotalPriceChange}
                        keyboardType="numeric"
                    />
                </View>
                <TouchableOpacity style={styles.addButton} onPress={handleAddRow}>
                    <Text style={styles.addButtonLabel}>Add Row</Text>
                </TouchableOpacity>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    },
    label: {
        fontSize: 14,
        paddingVertical: 8,
        paddingHorizontal: 2,
        fontWeight: 'bold',
        fontFamily: 'serif',
    },
    tableRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
    },
    columnHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        backgroundColor: '#206830',
        paddingVertical: 8,
        paddingHorizontal: 12,
        textAlign: 'center',
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
