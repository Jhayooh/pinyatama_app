import React, { useState, useEffect } from 'react'
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
import { collection } from 'firebase/firestore'
import { db } from '../firebase/Config'
import { useCollectionData } from 'react-firebase-hooks/firestore'

const GastosSaPinya = () => {
    const [gastos, setGastos] = useState([])

    return (
        <></>
    )
}

const Charts = () => {
    const query = collection(db, 'particulars')
    const [docs, loading, error] = useCollectionData(query)

    const [data, setData] = useState([])

    useEffect(() => {
      docs?.map(doc => {
        console.log(doc);
      })

    }, [docs])
    

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