import React from 'react';
import { StyleSheet, TextInput } from "react-native";

const Inputs = () => {
    return (
        <TextInput
        editable
        maxLength={40}
        onChangeText={text => setFarmName(text)}
        placeholder='Date of Planting'
        value={farmName}
        style={styles.dropdown}
      />
    )
}
export default Inputs

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:"center" ,
        width:"100%" ,
        marginTop: 50
    }



})