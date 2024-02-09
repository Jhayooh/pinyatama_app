import React, { useState, useEffect } from 'react'
import {
    View,
    Text,
    ImageBackground,
    StyleSheet,
    ScrollView,
    ActivityIndicator
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

    const color = ["rgb(0, 255, 0)", "rgb(0, 0, 255)", "rgb(255, 0, 0)"]

    useEffect(() => {
        setData(docs?.map((doc, index) => (
            {
                ...doc,
                color: color[index],
                legendFontColor: "#7F7F7F",
                legendFontSize: 15
            }
        )))


    }, [docs])

    console.log(data);

    return (
        <>

            <ScrollView>
                {loading
                    ?
                    <ActivityIndicator size='small' color='#3bcd6b' style={{ padding: 64, backgroundColor: '#fff' }} />

                    :
                    <>
                        <DoughnutAndPie data={data} />
                        <Line />
                        <Bar />
                        <DoughnutAndPie />
                        <Progress />
                    </>
                }
            </ScrollView>
        </>
    )
}

const styles = StyleSheet.create({
    image: {
        flex: 1,
        resizeMode: 'cover',
    }
})

export default Charts