import React from 'react'
import {
    ProgressChart
} from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const data = {
    labels: ["Swim"], // optional
    data: [0.4]
};

export const Progress = () => {
    const screenWidth = Dimensions.get('window').width;
    const chartConfig = {
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        style: {
            borderRadius: 16
        }
    };
    return (
        <ProgressChart
            style={{
                marginVertical: 8,
                ...chartConfig.style
            }}
            data={data}
            width={screenWidth}
            height={220}
            strokeWidth={32}
            radius={64}
            chartConfig={chartConfig}
            hideLegend={false}
        />
    )
}
