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
    const farm = farms[0]
    console.log('this is the farms from chart', farm);
    const [isShow, setIsShow] = useState(false)
    const [selectedDay, setSelectedDay] = useState('')
    const [activities, setActivities] = useState({})
    const [startDate, setStartDate] = useState('')

    const componentColl = collection(db, `farms/${farm.id}/components`)
    const [compData, compLoading, compError] = useCollectionData(componentColl)

    const roiColl = collection(db, `farms/${farm.id}/roi`)
    const [roiData, roiLoading, roiError] = useCollectionData(roiColl)

    const pineappleColl = collection(db, 'pineapple')
    const [pineData, pineLoading, pineError] = useCollectionData(pineappleColl)

    const [partTotal, setPartTotal] = useState([])
    const [pineTotal, setPineTotal] = useState([])
    const [netReturn, setNetReturn] = useState([])
    const [newRoi, setNewRoi] = useState({})

    function getPinePrice(pine, pineObject) {
        const newPine = pineObject.filter(thePine => thePine.name.toLowerCase() === pine.toLowerCase())[0]
        return newPine.price
    }

    const getPercentage = (n1, n2) => {
        console.log("pirsint", (n1 / n2) * 100);
        return (n1 / n2) * 100
    }

    useEffect(() => {
        if (!roiData || !pineData) return

        setNewRoi([
            {
                name: 'ROI',
                sum: roiData[0].netReturn,
                color: '#F7BF0B',
                legendFontColor: "#7F7F7F",
                legendFontSize: 16
            },
            {
                name: 'Gastos',
                sum: roiData[0].materialTotal + roiData[0].laborTotal,
                color: '#40A040',
                legendFontColor: "#7F7F7F",
                legendFontSize: 16
            }
        ])
        setPartTotal([
            {
                name: 'Material',
                sum: roiData[0].materialTotal - roiData[0].fertilizerTotal,
                color: '#F7BF0B',
                legendFontColor: "#7F7F7F",
                legendFontSize: 16
            },
            {
                name: 'Labor',
                sum: roiData[0].laborTotal,
                color: '#40A040',
                legendFontColor: "#7F7F7F",
                legendFontSize: 16
            },
            {
                name: 'Fertilizer',
                sum: roiData[0].fertilizerTotal,
                color: '#E74C3C',
                legendFontColor: "#7F7F7F",
                legendFontSize: 16
            }
        ])
        setPineTotal([
            {
                name: 'Good size',
                sum: roiData[0].grossReturn * getPinePrice('good size', pineData),
                color: '#F7BF0B',
                legendFontColor: "#7F7F7F",
                legendFontSize: 16
            },
            {
                name: 'Butterball',
                sum: roiData[0].butterBall * getPinePrice('butterball', pineData),
                color: '#40A040',
                legendFontColor: "#7F7F7F",
                legendFontSize: 16
            }
        ])
        setNetReturn([
            {
                name: 'Net Return',
                sum: roiData[0].netReturn,
                color: '#FF5733',
                legendFontColor: "#7F7F7F",
                legendFontSize: 16
            }
        ])
    }, [roiData, pineData]);

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
    return (
        <>
            <ScrollView style={{

            }}>
                <View style={{
                    flex: 1,
                    flexDirection: 'column',
                    gap: 8,
                    paddingVertical: 8,
                    margin: 15
                }}>
                    <View>
                    </View>
                    {/* Calendar */}
                    {/* <Calendar
                        markingType='period'
                        style={{
                            borderRadius: 16,
                            height: 380,
                            backgroundColor: '#fff',
                            shadowColor: 'green',
                            shadowOffset: {
                                width: 0,
                                height: 2,
                            },
                            shadowOpacity: 0.25,
                            shadowRadius: 3.84,
                            elevation: 5
                        }}
                        onDayPress={day => {
                            setIsShow(true)
                            setSelectedDay(day.dateString);
                        }}
                        markedDates={activities}
                    /> */}
                    {/* ROI */}
                    {
                        roiLoading && !newRoi || Object.keys(newRoi).length === 0
                            ?
                            <ActivityIndicator />
                            :
                            <View style={{
                                padding: 4,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 16,
                                backgroundColor: '#fff',
                                shadowColor: 'green',
                                shadowOffset: {
                                    width: 0,
                                    height: 2,
                                },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,
                                elevation: 5
                            }}>
                                <Text style={{ fontSize: 20, marginVertical: 12, fontWeight: '600', color: 'green' }}>ROI</Text>
                                <DoughnutAndPie data={newRoi} col={'sum'} title="Expected QP Production" />
                            </View>
                    }
                    {/* Gastos sa Pinya */}
                    {
                        roiLoading && partTotal.length > 0
                            ?
                            <ActivityIndicator />
                            :
                            <View style={{
                                padding: 4,
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#fff',
                                shadowColor: 'green',
                                shadowOffset: {
                                    width: 0,
                                    height: 2,
                                },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,
                                elevation: 5,
                                flex: 1,
                                borderRadius: 16,

                            }}>
                                <Text style={{ fontSize: 20, marginVertical: 12, fontWeight: '600', color: 'green' }}>Gastos sa Pinya</Text>
                                <DoughnutAndPie data={partTotal} col={"sum"} title="Gastos sa Pinya" />
                            </View>
                    }
                    {/* Gross Return */}
                    {
                        roiLoading && pineTotal.length > 0
                            ?
                            <ActivityIndicator />
                            :
                            <View style={{
                                padding: 4,
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#fff',
                                shadowColor: 'green',
                                shadowOffset: {
                                    width: 0,
                                    height: 2,
                                },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,
                                elevation: 5,
                                flex: 1,
                                borderRadius: 16,
                            }}>
                                <Text style={{ fontSize: 20, marginVertical: 12, fontWeight: '600', color: 'green' }}>Gross Return</Text>
                                <DoughnutAndPie data={pineTotal} col={"sum"} title="Gross Return" />
                            </View>
                    }
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