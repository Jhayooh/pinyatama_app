import React from 'react'
import { BarChart } from 'react-native-chart-kit'
import { Dimensions } from 'react-native';

const data = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
        {
            data: [20, 45, 28, 80, 99, 43]
        }
    ]
};

export const Bar = () => {
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
                marginVertical: 8,
                ...chartConfig.style
            }}
            data={data}
            width={screenWidth}
            height={240}
            yAxisLabel="$"
            chartConfig={chartConfig}
            verticalLabelRotation={30}
        />
    )
}
