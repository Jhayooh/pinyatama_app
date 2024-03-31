import React, { useState, useEffect } from 'react'
import {
    View,
    Text,
    ImageBackground,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    Button,
    Modal
} from 'react-native'
import { DoughnutAndPie } from './charts/DoughnutAndPie'
import { Line } from './charts/Line'
import { Bar } from './charts/Bar'
import { Progress } from './charts/Progress'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase/Config'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { Calendar, Agenda } from "react-native-calendars";
import moment from 'moment'
import DateTimePicker from '@react-native-community/datetimepicker';

const GastosSaPinya = () => {
    const [gastos, setGastos] = useState([])

    return (
        <>

        </>
    )
}

const Charts = ({ farms }) => {
    console.log('this is the farms from chart', farms);
    const [isShow, setIsShow] = useState(false)
    const [selectedDay, setSelectedDay] = useState('')
    const [activities, setActivities] = useState({})
    const [startDate, setStartDate] = useState('')

    const getMaxSched = ({ date }) => {
        return moment(date).add(2, 'month')
    }

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setShow(false);
        setDate(currentDate);
    };

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode('date');
    };

    const showTimepicker = () => {
        showMode('time');
    };

    const formatDate = (toFormatDate) => {
        return toFormatDate.toDate().toISOString().split('T')[0];
    }

    const generateDateRange = (startDate, endDate) => {
        console.log("start:", startDate);
        console.log("end:", endDate);
        const dates = {};
        let currentDate = moment(startDate);
        const formattedEndDate = moment(endDate);

        while (currentDate <= formattedEndDate) {
            const formattedDate = currentDate.format('YYYY-MM-DD');
            dates[formattedDate] = {
                color: '#50cebb',
                textColor: 'white',
            };
            currentDate = currentDate.add(1, 'days');
        }
        return dates;
    };

    const color = ["rgb(0, 255, 0)", "rgb(0, 0, 255)", "rgb(255, 0, 0)"]
    // useEffect(() => {
    //     setData(
    //         farms?.map((doc, index) => (
    //             {
    //                 ...doc,
    //                 color: color[index],
    //                 legendFontColor: "#7F7F7F",
    //                 legendFontSize: 15
    //             }
    //         ))
    //     )
    //     if (schedDoc) {
    //         const newSched = schedDoc.reduce((acc, doc) => {
    //             console.log("pa print po ng doc:", doc);
    //             console.log("tingin ng subcollection", checkCollection(`${pathPhases}/${doc.name}/activities`));
    //             const startDate = doc.starDate;
    //             const formattedDate = formatDate(startDate)
    //             acc[formattedDate] = {
    //                 startingDay: true,
    //                 color: '#50cebb',
    //                 textColor: 'white',
    //             };
    //             if (doc.name === 'pagtatanim') {
    //                 setMaxMonth(formatDate(getMaxSched(startDate)))
    //                 setStartDate(formattedDate)
    //             }
    //             return acc;
    //         }, {});
    //         setSched(prevSched => ({ ...prevSched, ...newSched }));
    //     }

    //     if (actDoc) {
    //         const newAct = actDoc.reduce((acc, doc) => {
    //             const createdDate = doc.createdDate;
    //             const formattedDate = formatDate(createdDate)
    //             console.log("this is my docact", formattedDate);
    //             acc[formattedDate] = {
    //                 ...doc,
    //                 marked: true,
    //                 dotColor: 'red'
    //             };
    //             return acc;
    //         }, {});
    //         setActivities(prevActs => ({ ...prevActs, ...newAct }));
    //     }
    // }, [docs, schedDoc, actDoc])

    return (
        <>
            <ScrollView style={{
                padding: 12,

            }}>
                    <View style={{
                        flex: 1,
                        flexDirection: 'column',
                        gap: 8,
                        paddingVertical: 8
                    }}>
                        <View>

                        </View>
                        <Calendar
                            markingType='period'
                            style={{
                                borderRadius: 16,
                                height: 380
                            }}
                            onDayPress={day => {
                                setIsShow(true)
                                setSelectedDay(day.dateString);
                            }}
                            markedDates={activities}
                        />
                        <DoughnutAndPie />
                        <Line />
                        <Bar />
                        <DoughnutAndPie />
                        <Progress />
                    </View>
            </ScrollView>

            <Modal animationType='fade' transparent={true} visible={isShow} onRequestClose={() => (setIsShow(!isShow))}>
                <View style={styles.modalContainer}>
                    {
                        activities.hasOwnProperty(selectedDay) ?
                            <Text>Meron akong actibidades</Text> :
                            <Text>No activity</Text>
                    }

                    <Button title='isarado mo ako' onPress={() => setIsShow(!isShow)} />
                </View>
            </Modal>
        </>
    )
}

const styles = StyleSheet.create({
    image: {
        flex: 1,
        resizeMode: 'cover',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: '#ccc',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
})

export default Charts