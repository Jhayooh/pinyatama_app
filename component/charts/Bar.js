import React from 'react'
import { BarChart } from 'react-native-chart-kit'
import { Dimensions, View } from 'react-native';

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
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <BarChart
                style={{
                    ...chartConfig.style
                }}
                data={data}
                width={screenWidth * .94}
                height={250}
                yAxisLabel="$"
                chartConfig={chartConfig}
                verticalLabelRotation={30}

            />
        </View>
    )
}
