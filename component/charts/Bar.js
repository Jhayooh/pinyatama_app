import React from 'react'
import { BarChart } from 'react-native-chart-kit'
import { Dimensions, View } from 'react-native';

export const Bar = ({ data }) => {
    const screenWidth = Dimensions.get('window').width;

    const chartConfig = {
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        style: {
            borderRadius: 16
        }
    };
    return (
        <BarChart
            style={{
                ...chartConfig.style
            }}
            data={data}
            width={screenWidth * .94}
            height={250}
            chartConfig={chartConfig}
            verticalLabelRotation={30}
        />
    )
}
