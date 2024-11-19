import React, { useState, useEffect } from 'react';
import { PieChart } from "react-native-gifted-charts";
import { Dimensions, View, Text, ActivityIndicator } from 'react-native';

// List of possible colors
const colorList = [
    "#F7BF0B", //yilo
    "#40A040", //grin
    "#E74C3C", //rid
];

export const DoughnutAndPie = ({ data, col }) => {
    const screenWidth = Dimensions.get('window').width;

    const coloredData = data.map((item, index) => ({
        ...item,
        color: colorList[index % colorList.length]
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
                            <Text style={{ fontSize: 16, color: 'black', textAlign: 'flex-start' }}>
                                {item.name}
                            </Text>
                        </View>
                    ))}
                </View>
            </View>
        </>
    );
};
