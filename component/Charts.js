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
import { Calendar } from "react-native-calendars";

const GastosSaPinya = () => {
    const [gastos, setGastos] = useState([])

    return (
        <></>
    )
}

const Charts = () => {
    const [selectedDay, setSelectedDay] = useState('')
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
                    <View style={{
                        flex: 1,
                        flexDirection: 'column',
                        gap: 8,
                        paddingVertical: 8
                    }}>
                        <DoughnutAndPie data={data} />
                        <Line />
                        <Bar />
                        <DoughnutAndPie />
                        <Progress />
                        <Calendar
                            markingType='period'
                            style={{
                                borderRadius: 16,
                                height: 320
                            }}
                            onDayPress={day => {
                                setSelectedDay(day.dateString);
                            }}
                            markedDates={{
                                '2024-02-15': { marked: true, dotColor: '#50cebb' },
                                '2024-02-16': { marked: true, dotColor: '#50cebb' },
                                '2024-02-17': { startingDay: true, color: '#50cebb', textColor: 'white' },
                                '2024-02-18': { color: '#70d7c7', textColor: 'white' },
                                '2024-02-19': { color: '#70d7c7', textColor: 'white', marked: true, dotColor: 'white' },
                                '2024-02-20': { color: '#70d7c7', textColor: 'white' },
                                '2024-02-21': { endingDay: true, color: '#50cebb', textColor: 'white' }
                            }}
                        />
                    </View>
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