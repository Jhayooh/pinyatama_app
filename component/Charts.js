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



const Charts = ({ farm }) => {
    const componentColl = collection(db, `farms/${farm.id}/components`)
    const [compData, compLoading, compError] = useCollectionData(componentColl)

    const pineappleColl = collection(db, 'pineapple')
    const [pineData, pineLoading, pineError] = useCollectionData(pineappleColl)

    const eventsColl = collection(db, `farms/${farm.id}/events`)
    const [eventsData, eventsLoading] = useCollectionData(eventsColl)


    const [partTotal, setPartTotal] = useState(null)
    const [pineTotal, setPineTotal] = useState(null)
    const [netReturn, setNetReturn] = useState(null)
    const [newRoi, setNewRoi] = useState(null)

    function getPinePrice(pine, pineObject) {
        const newPine = pineObject.filter(thePine => thePine.name.toLowerCase() === pine.toLowerCase())[0]
        return newPine.price
    }

    const getPercentage = (n1, n2) => {
        // console.log("pirsint", (n1 / n2) * 100);
        return (n1 / n2) * 100
    }
    const format = (num) => {
        return num.toLocaleString('en-US'
        )
      }

    useEffect(() => {
        if (!pineData && !farm) return
        
        const roi = farm.roi.find(actRoi => actRoi.type === 'a')

        setNewRoi([
            {
              name: 'ROI',
              value: roi.netReturn,
              text: `${Math.round(getPercentage(roi.netReturn, (roi.materialTotal + roi.laborTotal + roi.netReturn + roi.fertilizerTotal)))}%(${format(Math.round(roi.netReturn))})`,
            },
            {
              name: 'Gastos',
              value: roi.materialTotal + roi.laborTotal + roi.fertilizerTotal,
              text: `${Math.round(getPercentage(roi.materialTotal + roi.laborTotal + roi.fertilizerTotal, (roi.materialTotal + roi.laborTotal + roi.netReturn + roi.fertilizerTotal)))}%(${format(Math.round(roi.materialTotal + roi.laborTotal + roi.fertilizerTotal))})`,
            }
          ])
        setPartTotal([
            {
                name: 'Material',
                value: roi.materialTotal,
                text: `${Math.round(getPercentage(roi.materialTotal, (roi.materialTotal + roi.laborTotal + roi.fertilizerTotal)))}%(${format(Math.round(roi.materialTotal))})`,
            },
            {
                name: 'Labor',
                value: roi.laborTotal,
                text: `${Math.round(getPercentage( roi.laborTotal, (roi.materialTotal + roi.laborTotal + roi.fertilizerTotal)))}%(${format(Math.round(roi.laborTotal))})`,
                
            },
            {
                name: 'Fertilizer',
                value: roi.fertilizerTotal,
                text: `${Math.round(getPercentage(roi.fertilizerTotal, (roi.materialTotal + roi.laborTotal + roi.fertilizerTotal)))}%(${format(Math.round(roi.fertilizerTotal))})`,
            }
        ])
        setPineTotal([
            {
                name: 'Good size',
                value: roi.grossReturn,
                text: `${Math.round(getPercentage(roi.grossReturn, (roi.grossReturn + roi.butterBall )))}%(${format(Math.round(roi.grossReturn))})`,
            },
            {
                name: 'Batterball',
                value: roi.butterBall,
                text: `${Math.round(getPercentage( roi.butterBall, (roi.grossReturn + roi.butterBall )))}%(${format(Math.round(roi.butterBall))})`,
            }
        ])
        setNetReturn([
            {
                name: 'Net Return',
                value: roi.netReturn,
                text: `${Math.round(getPercentage(roi.netReturn, (roi.materialTotal + roi.laborTotal + roi.fertilizerTotal)))} % `,
            }
        ])
    }, [pineData, farm]);

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
                            eventsLoading
                                ? <View style={{ padding: 32, margin: 12 }}>
                                    <ActivityIndicator size={'large'} color={'#F6A30B'} />
                                </View>
                                : (
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
                        <Text style={{ fontSize: 20, marginVertical: 12, fontWeight: '600', color: 'green' }}>ROI (₱)</Text>
                        {
                            !newRoi
                                ? <View style={{ padding: 32, margin: 12 }}>
                                    <ActivityIndicator size={'large'} color={'#F6A30B'} />
                                </View>
                                : <DoughnutAndPie data={newRoi} col={'sum'} title="Expected QP Production" />
                        }
                    </View>
                    {/* Gastos sa Pinya */}
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
                        <Text style={{ fontSize: 20, marginVertical: 12, fontWeight: '600', color: 'green' }}>Gastos sa Pinya(₱)</Text>
                        {
                            !newRoi && !partTotal
                                ? <View style={{ padding: 32, margin: 12 }}>
                                    <ActivityIndicator size={'large'} color={'#F6A30B'} />
                                </View>
                                : <DoughnutAndPie data={partTotal} col={"sum"} title="Gastos sa Pinya" />
                        }
                    </View>
                    {/* Gross Return */}
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
                        <Text style={{ fontSize: 20, marginVertical: 12, fontWeight: '600', color: 'green' }}>Gross Return (pcs)</Text>
                        {
                            !newRoi && !pineTotal
                                ? <View style={{ padding: 32, margin: 12 }}>
                                    <ActivityIndicator size={'large'} color={'#F6A30B'} />
                                </View>
                                : <DoughnutAndPie data={pineTotal} col={"sum"} title="Gross Return" />
                        }
                    </View>
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