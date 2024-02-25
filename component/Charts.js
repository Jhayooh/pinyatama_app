import React, { useState, useEffect } from 'react'
import {
    View,
    Text,
    ImageBackground,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    Button
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

const Charts = ({ pathParticular, pathPhases, pathActivities }) => {
    const [selectedDay, setSelectedDay] = useState('')
    const query = collection(db, pathParticular)
    const [docs, loading, error] = useCollectionData(query)
    const [data, setData] = useState([])

    const [date, setDate] = useState(new Date(1598051730000));
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [maxMonth, setMaxMonth] = useState('')
    const schedQue = collection(db, pathPhases)
    const [schedDoc, schedLoading, schedError] = useCollectionData(schedQue)
    const [sched, setSched] = useState({

    })
    const actQuery = collection(db, pathActivities)
    const [actDoc, actLoading, actError] = useCollectionData(actQuery)
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

    const checkCollection = async (collPath) => {
        try {
            const collectionRef = collection(db, collPath);
            const snapshot = await getDocs(collectionRef);
            return !snapshot.empty;
        } catch (error) {
            console.error('Error checking collection:', error);
            return false;
        }
    };

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
    useEffect(() => {
        setData(
            docs?.map((doc, index) => (
                {
                    ...doc,
                    color: color[index],
                    legendFontColor: "#7F7F7F",
                    legendFontSize: 15
                }
            ))
        )
        if (schedDoc) {
            const newSched = schedDoc.reduce((acc, doc) => {
                console.log("pa print po ng doc:", doc);
                console.log("tingin ng subcollection", checkCollection(`${pathPhases}/${doc.name}/activities`));
                const startDate = doc.starDate;
                const formattedDate = formatDate(startDate)
                acc[formattedDate] = {
                    startingDay: true,
                    color: '#50cebb',
                    textColor: 'white',
                };
                if (doc.name === 'pagtatanim') {
                    setMaxMonth(formatDate(getMaxSched(startDate)))
                    setStartDate(formattedDate)
                }
                return acc;
            }, {});
            setSched(prevSched => ({ ...prevSched, ...newSched }));
        }

        if (actDoc) {
            const newAct = actDoc.reduce((acc, doc) => {
                const createdDate = doc.createdDate;
                const formattedDate = formatDate(createdDate)
                console.log("this is my docact", formattedDate);
                acc[formattedDate] = {
                    marked: true,
                    dotColor: 'red'
                };
                return acc;
            }, {});
            setActivities(prevActs => ({ ...prevActs, ...newAct }));
        }
    }, [docs, schedDoc, actDoc])
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
                        <Calendar
                            markingType='period'
                            style={{
                                borderRadius: 16,
                                height: 380
                            }}
                            onDayPress={day => {
                                
                                alert(day.dateString)
                                setSelectedDay(day.dateString);
                            }}
                            markedDates={{
                                ...activities,
                                // ...generateDateRange(startDate, maxMonth),
                                // [maxMonth]: { endingDay: true, color: '#50cebb', textColor: 'white' },
                            }}
                        />
                        <DoughnutAndPie data={data} />
                        <Line />
                        <Bar />
                        <DoughnutAndPie />
                        <Progress />
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