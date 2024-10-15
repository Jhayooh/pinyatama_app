import React, { useMemo } from 'react';
import { Dimensions, View, Text, StyleSheet } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { ActivityIndicator } from 'react-native-paper';
import { FontAwesome } from '@expo/vector-icons'; // Import FontAwesome

const Pie = ({ labels = [], data = [], colors, title }) => {
    const screenWidth = Dimensions.get('window').width;

    // Limit the labels and data to the first 10 entries
    const limitedLabels = labels ? labels.slice(0, 10) : ["Default Label"];
    const limitedData = data ? data.slice(0, 10) : [44, 45, 2, 3, 4, 5, 6, 7, 8];

    // Generate colors for the chart if not provided
    const defaultColors = [
        '#FF6700', '#FFB000', '#FFE600', '#7FDD05', '#00A585', '#22BCF2',
        '#1256CC', '#803AD0', '#B568F2', '#CC2782', '#FF71BF', '#7EE8C7'
    ];
    const colorsArray = colors && colors.length >= limitedLabels.length
        ? colors
        : defaultColors.slice(0, limitedLabels.length);

    // Calculate total value to compute percentages
    const totalValue = limitedData.reduce((acc, value) => acc + value, 0);

    // Prepare the data in the format required by PieChart
    const chartData = limitedLabels.map((label, index) => ({
        name: label,
        value: limitedData[index],
        percentage: ((limitedData[index] / totalValue) * 100).toFixed(2), // Calculate percentage
        color: colorsArray[index],
        legendFontColor: "#7F7F7F",
        legendFontSize: 15,
    }));

    // Use useMemo to sort the data based on the values
    const sortedData = useMemo(() => {
        return chartData.sort((a, b) => b.value - a.value);
    }, [chartData]);

    return (
        <View style={{ alignItems: 'center', justifyContent: 'center', minHeight: 80, flex: 1 }}>
            <Text style={{ fontSize: 20, textAlign: 'left', marginBottom: 10, fontFamily:'serif', color:'green' }}>
                {`${title} Pineapple Plantation`}
            </Text>
            {
                chartData.length === 0
                    ? <ActivityIndicator />
                    :
                    <>
                        <PieChart
                            data={chartData}
                            width={screenWidth * .94}
                            height={300}
                            chartConfig={{
                                backgroundGradientFromOpacity: 0,
                                backgroundGradientToOpacity: 0,
                                color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
                                strokeWidth: 2,
                                useShadowColorFromDataset: false,
                                style: {
                                    borderRadius: 16,
                                }
                            }}
                            accessor="value"
                            backgroundColor="transparent"
                            paddingLeft={Dimensions.get("window").width / 4}
                            hasLegend={false} // Remove the default legend
                        />
                        <View style={styles.legend}>
                            {sortedData.map((chartDataItem) => (
                                <View style={styles.legendItem} key={chartDataItem.name}>
                                    <FontAwesome name="circle" size={16} color={chartDataItem.color} />
                                    <Text style={styles.legendItemValue}>
                                        {`${chartDataItem.percentage}%`}
                                    </Text>
                                    <Text>{chartDataItem.name}</Text>
                                </View>
                            ))}
                        </View>
                    </>
            }
        </View>
    );
};

// Define custom styles for the legends and layout
const styles = StyleSheet.create({
    legend: {
        marginHorizontal: 10,
        marginTop: 15,
    },
    legendItem: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 5,
    },
    legendItemValue: {
        marginHorizontal: 10,
        fontWeight: "bold",
    },
});

export default Pie;
