import React, { useMemo } from 'react';
import { Dimensions, View, Text, StyleSheet } from 'react-native';
//import { PieChart } from 'react-native-chart-kit';
import { ActivityIndicator } from 'react-native-paper';
import { FontAwesome } from '@expo/vector-icons'; // Import FontAwesome
import { PieChart } from "react-native-gifted-charts";

const Pie = ({ series, title }) => {
    const screenWidth = Dimensions.get('window').width;


    console.log(" seriesss: ", series);


    return (
        <View style={{ alignItems: 'center', justifyContent: 'center', minHeight: 80}}>
            <Text style={{ fontSize: 18, textAlign: 'left', marginBottom: 10, fontFamily: 'serif', color: 'green' }}>
                {title}
            </Text>
            {
                series.length === 0
                    ? <ActivityIndicator />
                    :
                    <>
                        <PieChart
                            strokeColor="white"
                            strokeWidth={3}
                            data={series}
                            // width={screenWidth * .94}
                            // height={300}
                            showText
                            textColor='black'
                            textSize={13}
                            focusOnPress
                            showValuesAsLabelsLegend={false}

                        />
                    </>
            }
            <View
                style={{
                    width: '100%',
                    flexDirection: 'column',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    marginTop: 20,
                }}
            >
                {series.map(item => (
                    <View
                        key={item.name}
                        style={{
                            width: '50%',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            paddingVertical: 5,
                        }}
                    >
                        <View
                            style={{
                                height: 18,
                                width: 18,
                                backgroundColor: item.color || 'gray',
                                borderRadius: 4,
                                marginRight: 10,
                            }}
                        />
                        <Text style={{ fontSize: 16, color: 'black' }}>
                            {item.name}
                        </Text>
                    </View>
                ))}
            </View>


        </View>
    );
};

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
