import React, { Component, useState, useEffect } from 'react'
import {
    PieChart
} from "react-native-chart-kit";
import { Dimensions, View } from 'react-native';

export const DoughnutAndPie = ({ data }) => {
    const screenWidth = Dimensions.get('window').width;
    const [newData, setNewData] = useState([])
    console.log("data1");

    useEffect(() => {
        let materialSum = 0;
        let laborSum = 0;
        console.log("data2")

        data.forEach((d) => {
            if (d.particular.toLowerCase() === 'material') {
                materialSum += parseInt(d.totalPrice);
            } else if (d.particular.toLowerCase() === 'labor') {
                laborSum += parseInt(d.totalPrice);
            }
        });
        console.log("data3");

        setNewData([
            {
                name: 'Material',
                sum: materialSum,
                color: '#FF5733',
                legendFontColor: "#7F7F7F",
                legendFontSize: 15
            },
            {
                name: 'Labor',
                sum: laborSum,
                color: '#4682B4',
                legendFontColor: "#7F7F7F",
                legendFontSize: 15
            }
        ])
        console.log("data sa dunat:",newData);
    }, [data]);

    const chartConfig = {
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        style: {
            borderRadius: 16
        }
    };
    return (
        <>
            {newData.length > 0
                &&
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <PieChart
                        style={{
                            ...chartConfig.style
                        }}
                        data={newData}
                        width={screenWidth * .94}
                        height={220}
                        chartConfig={chartConfig}
                        accessor={"sum"}
                    />
                </View>}
        </>
    )
}
