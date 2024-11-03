import React, { useMemo } from 'react';
import { Dimensions, View, Text, StyleSheet } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { ActivityIndicator } from 'react-native-paper';
import { FontAwesome } from '@expo/vector-icons'; // Import FontAwesome

const Pie = ({ series, title }) => {
    const screenWidth = Dimensions.get('window').width;
    
    console.log(" seriesss: ", series);
    // // Use useMemo to sort the data based on the values
    const sortedData = useMemo(() => {
        return series.sort((a, b) => b.value - a.value);
    }, [series]);

    return (
        <View style={{ alignItems: 'center', justifyContent: 'center', minHeight: 80, flex: 1 }}>
            <Text style={{ fontSize: 20, textAlign: 'left', marginBottom: 10, fontFamily: 'serif', color: 'green' }}>
                {title}
            </Text>
            <PieChart
                data={series}
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
                accessor="population"
                backgroundColor="transparent"
                paddingLeft={Dimensions.get("window").width / 4}
                hasLegend={false}
            />
            <View style={styles.legend}>
                {sortedData.map((chartDataItem) => (
                    <View style={styles.legendItem} key={chartDataItem.name}>
                        <FontAwesome name="circle" size={16} color={chartDataItem.color} />
                        <Text style={styles.legendItemValue}>
                            {`${chartDataItem.population}`}
                        </Text>
                        <Text>{chartDataItem.name}</Text>
                    </View>
                ))}
            </View>
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
