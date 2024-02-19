import React from 'react'
import {
    LineChart
} from "react-native-chart-kit";
import { Dimensions, View } from "react-native";

const data = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
        {
            data: [20, 45, 28, 80, 99, 43],
            color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
            strokeWidth: 2 // optional
        }
    ],
    legend: ["Pineapple Harvest"] // optional
};

export const Line = () => {

    const screenWidth = Dimensions.get('window').width;

    const chartConfig = {
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        style: {
            borderRadius: 16
        }
    };
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <LineChart
                style={{
                    ...chartConfig.style
                }}
                data={data}
                width={screenWidth*.94}
                height={220}
                chartConfig={chartConfig}
            />
        </View>
    )
}
