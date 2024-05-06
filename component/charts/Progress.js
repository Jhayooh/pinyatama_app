import React, { useState, useEffect } from 'react'
import {
    ProgressChart
} from 'react-native-chart-kit';
import { ActivityIndicator, Dimensions, View } from 'react-native';


export const Progress = ({ data }) => {
    const screenWidth = Dimensions.get('window').width;
    const chartConfig = {
        backgroundColor: '#ffffff',
        backgroundGradientFromOpacity: 0,
        backgroundGradientToOpacity: 0,
        color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
        strokeWidth: 2, // optional, default 3
        barPercentage: 0.5,
        useShadowColorFromDataset: false, // optional
        style: {
            borderRadius: 16,
        }
    };
    // useEffect(() => {
    //     setNewData({
    //         labels: ["Total Cost", "Net Return", "ROI"],
    //         data: [0.4, 0.6, 0.8]
    //     })

    // }, [data])
    // const data = {
    //     labels: ["Swim", "Bike", "Run"], // optional
    //     data: [0.4, 0.6, 0.8]
    //   };
    return (
        <>
            <View style={{ alignItems: 'center', justifyContent: 'center', minHeight: 80 }}>
                {
                    !data || Object.keys(data).length === 0
                        ?
                        <ActivityIndicator />
                        :
                        <ProgressChart
                            data={data}
                            width={screenWidth * .94}
                            height={220}
                            strokeWidth={28}
                            radius={72}
                            chartConfig={chartConfig}
                            hideLegend={false}
                        />
                }
            </View>
        </>
    )
}
