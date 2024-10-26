import React, { useState, useEffect } from 'react'
import {
    View,
    Text,
    ImageBackground,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    Button,
    Modal,
    TouchableOpacity,
    Image
} from 'react-native'
import { DoughnutAndPie } from './charts/DoughnutAndPie'
import { Line } from './charts/Line'
import { Bar } from './charts/Bar'
import { Progress } from './charts/Progress'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase/Config'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { Calendar } from 'react-native-big-calendar';
import dayjs from 'dayjs'



const Charts = ({ farms }) => {
    const farm = farms[0]
    console.log('this is the farms from chart', farm);


    const componentColl = collection(db, `farms/${farm.id}/components`)
    const [compData, compLoading, compError] = useCollectionData(componentColl)

    const roiColl = collection(db, `farms/${farm.id}/roi`)
    const [roiData, roiLoading, roiError] = useCollectionData(roiColl)

    const pineappleColl = collection(db, 'pineapple')
    const [pineData, pineLoading, pineError] = useCollectionData(pineappleColl)

    const eventsColl = collection(db, `farms/${farm.id}/events`)
    const [eventsData] = useCollectionData(eventsColl)


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

    //all about calendaR

    const today = new Date();
    const [date, setDate] = useState(today);
    const [mode, setMode] = useState('month');

    const _onToday = () => setDate(today);

    const _onPrevDate = () => {
        if (mode === 'month') {
            setDate(dayjs(date).subtract(1, 'month').toDate());
        }
    };
    const _onNextDate = () => setDate(dayjs(date).add(1, 'month').toDate());

    // const filteredEvents = farms
    //     ? farms
    //         .filter(f => f.brgyUID === user?.uid)
    //         .map(f => ({
    //             start: f.start_date?.toDate() || new Date(),
    //             end: f.harvest_date?.toDate() || new Date(),
    //             title: f.title || 'No Title',
    //             stage: f.cropStage || 'vegetative',
    //             id:f.id
    //         }))
    //     : [];


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
                    margin: 15,
                }}>
                    <View style={{
                        padding: 4,
                        borderRadius: 5,
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

                        {/* Calendar */}

                        <Text style={styles.monthTitle}>{dayjs(date).format('MMMM DD, YYYY')}</Text>

                        <View style={styles.navigationRow}>
                            <TouchableOpacity onPress={_onPrevDate} >
                                <Image source={require('../assets/previous.png')} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={_onToday} style={styles.todayButton}>
                                <Text style={{ fontSize: 15 }}>Today</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={_onNextDate}>
                                <Image source={require('../assets/next.png')} />
                            </TouchableOpacity>

                        </View>
                        {
                            eventsData && (
                                <Calendar
                                    date={date}
                                    events={eventsData.map(f => ({
                                        start: f.start_time?.toDate() || new Date(),
                                        end: f.end_time?.toDate() || new Date(),
                                        title: f.title || 'No Title',
                                        id: f.id
                                    }))
                                    }
                                    height={500}
                                    mode={mode}
                                    hourRowHeight={40}
                                    timeslots={2}
                                    eventCellStyle={(event) => ({
                                        backgroundColor: event.title === 'Vegetative' ? '#68c690' :
                                            event.title === 'Flowering' ? '#FFDC2E' :
                                                event.title === 'Fruiting' ? '#FF8D21' : 'grey',
                                        borderRadius: 10,
                                        padding: 5,
                                        fontSize: 12,
                                    })}
                                />
                            )
                        }
                    </View>
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
                                borderRadius: 5,
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
                                borderRadius: 5,

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
                                borderRadius: 5,
                            }}>
                                <Text style={{ fontSize: 20, marginVertical: 12, fontWeight: '600', color: 'green' }}>Gross Return</Text>
                                <DoughnutAndPie data={pineTotal} col={"sum"} title="Gross Return" />
                            </View>
                    }
                </View>
            </ScrollView>
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
    navigationRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        paddingHorizontal: 10,
        marginTop: 5,
        borderWidth: 2,
        borderColor: 'grey'
    },

    monthTitle: {
        fontWeight: '700',
        fontSize: 30,
        fontFamily: 'serif',
        textAlign: 'center',
        flex: 1,
    },
    todayButton: {
        marginVertical: 10,
        alignItems: 'center',
        flex: 1,
    },
})

export default Charts