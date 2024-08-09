import React, { useState, useEffect } from 'react'
import {
    PieChart
} from "react-native-chart-kit";
import { Dimensions, View, Text, ActivityIndicator } from 'react-native';

export const DoughnutAndPie = ({ data, col }) => {
    const screenWidth = Dimensions.get('window').width;

    console.log(data)

    const chartConfig = {
        // backgroundColor: '#ffffff',
        backgroundGradientFromOpacity: 0,
        backgroundGradientToOpacity: 0,
        color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
        strokeWidth: 2, 
        // barPercentage: 0.5,
        useShadowColorFromDataset: false, 
        style: {
            borderRadius: 16,
        }

    };
    return (
        <>
            <View style={{ alignItems: 'center', justifyContent: 'center', minHeight: 80 }}>
                {
                    data.length === 0
                        ?
                        <ActivityIndicator />
                        :
                        <PieChart
                            style={{
                                ...chartConfig.style,
                            }}
                            data={data}
                            width={screenWidth * .94}
                            height={220}
                            chartConfig={chartConfig}
                            accessor={col}
                            backgroundColor={'transparent'}
                            paddingLeft='18'
                            // absolute // para maging whole value
                            relative //para maging percentage
                        />
                }
            </View>
        </>
    )
}
