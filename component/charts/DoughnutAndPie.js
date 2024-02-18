import React, { Component } from 'react'
import {
    PieChart
} from "react-native-chart-kit";
import { Dimensions, View, ActivityIndicator } from 'react-native';

export const DoughnutAndPie = ({ data }) => {
    const screenWidth = Dimensions.get('window').width;

    const chartConfig = {
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        style: {
            borderRadius: 16
        }
    };

    console.log("Chart: ", data);

    return (
        <>
            {data
                &&
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <PieChart
                        style={{
                            marginVertical: 8,
                            ...chartConfig.style
                        }}
                        data={data}
                        width={screenWidth * .94}
                        height={220}
                        chartConfig={chartConfig}
                        accessor={"totalInputs"}
                    />
                </View>}
        </>
    )
}
