import React, { useState, useEffect } from 'react';
import { PieChart } from "react-native-gifted-charts";
import { Dimensions, View, Text, ActivityIndicator } from 'react-native';

// List of possible colors
const colorList = [
    '#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9', '#BAE1FF',
    '#D4A5A5', '#FFD3B6', '#C9C9FF', '#E2F0CB', '#FFBEAA',
    '#FF9AA2', '#FFB7B2', '#FFDAC1', '#E0BBE4', '#D4A5A5',
    '#A0E7E5', '#B4F8C8', '#FFAEBC', '#AFCBFF', '#FFCECE',
    '#FFBCBC', '#FFD8D8', '#E1F7D5', '#FFFFD1', '#B2F7EF',
    '#FFC8A2', '#D3E4CD', '#F5E0B7', '#D2D7DF', '#FAD9C1',
    '#F3D1F4', '#E1E5EA', '#FFFCB6', '#BAED91', '#AED1E6',
    '#FFC6C6', '#FDFD96', '#B3B3FF', '#C4A3BF', '#C8E4EC',
    '#FFE5B4', '#FFCBF2', '#FFEEF2', '#D4E157', '#C6FFDD',
    '#F8BBD0', '#D3C1E5', '#C3FBD8', '#FAD1A5', '#CDE7B0'
];

export const DoughnutAndPie = ({ data, col }) => {
    const screenWidth = Dimensions.get('window').width;

    // Function to assign random colors from the colorList to each item
    const getRandomColor = () => {
        return colorList[Math.floor(Math.random() * colorList.length)];
    };

    // Add random colors to each data item
    const coloredData = data.map(item => ({
        ...item,
        color: getRandomColor()
    }));

    return (
        <>
            <View style={{ alignItems: 'center', justifyContent: 'center', minHeight: 80 }}>
                {
                    coloredData.length === 0
                        ? <ActivityIndicator />
                        : <PieChart
                            strokeColor="white"
                            strokeWidth={3}
                            data={coloredData}
                            showText
                            textColor='black'
                            textSize={14}
                            focusOnPress
                            showValuesAsLabelsLegend={false}
                        />
                }
                <View
                    style={{
                        width: '100%',
                        flexDirection: 'column',
                        justifyContent: 'space-around',
                        alignItems: 'center',
                        marginTop: 20,
                    }}
                >
                    {coloredData.map(item => (
                        <View
                            key={item.name}
                            style={{
                                width: '30%',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                paddingVertical: 5,
                            }}
                        >
                            <View
                                style={{
                                    height: 18,
                                    width: 18,
                                    backgroundColor: item.color || 'gray',
                                    borderRadius: 4,
                                    marginRight: 10,
                                }}
                            />
                            <Text style={{ fontSize: 16, color: 'black', textAlign: 'left' }}>
                                {item.name}
                            </Text>
                        </View>
                    ))}
                </View>
            </View>
        </>
    );
};
