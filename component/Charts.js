import React from 'react'
import {
    View,
    Text,
    ImageBackground,
    StyleSheet,
    ScrollView
} from 'react-native'
import { DoughnutAndPie } from './charts/DoughnutAndPie'
import { Line } from './charts/Line'
import { Bar } from './charts/Bar'
import { Progress } from './charts/Progress'

const Charts = () => {
    return (
                <ScrollView>
                    <DoughnutAndPie />
                    <Line />
                    <Bar />
                    <DoughnutAndPie />
                    <Progress />
                </ScrollView>
    )
}

const styles = StyleSheet.create({
    image: {
        flex: 1,
        resizeMode: 'cover',
    }
})

export default Charts