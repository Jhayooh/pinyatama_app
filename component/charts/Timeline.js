import { Text, Button, View, StyleSheet, Image } from 'react-native';
import { Calendar } from 'react-native-big-calendar';
import dayjs from 'dayjs';
import { useState } from 'react';
import { db, auth } from '../../firebase/Config';
import { collection } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { TouchableOpacity } from 'react-native';


const Timeline = ({ navigation }) => {
    const farmsColl = collection(db, `/farms`);
    const [farms] = useCollectionData(farmsColl);
    const user = auth.currentUser;
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

    const filteredEvents = farms
        ? farms
            .filter(f => f.brgyUID === user?.uid)
            .map(f => ({
                start: f.start_date?.toDate() || new Date(),
                end: f.harvest_date?.toDate() || new Date(),
                title: f.title || 'No Title',
                stage: f.cropStage || 'vegetative'
            }))
        : [];

    return (
        <>

            <Text style={styles.monthTitle}>{dayjs(date).format('MMMM DD, YYYY')}</Text>

            <View style={styles.navigationRow}>
                <TouchableOpacity onPress={_onPrevDate} >
                    <Image source={require('../../assets/previous.png')} />
                </TouchableOpacity>
                <TouchableOpacity onPress={_onToday} style={styles.todayButton}>
                    <Text style={{fontSize:15}}>Today</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={_onNextDate}>
                    <Image source={require('../../assets/next.png')} />
                </TouchableOpacity>

            </View>



            <View style={styles.legendContainer}>
                <View style={styles.legendItem}>
                    <View style={styles.v}></View>
                    <Text>Vegetative</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={styles.fl}></View>
                    <Text>Flowering</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={styles.fr}></View>
                    <Text>Fruiting</Text>
                </View>
            </View>
            {farms && (
                <Calendar
                    date={date}
                    events={filteredEvents}
                    height={500}
                    mode={mode}
                    hourRowHeight={40}
                    timeslots={2}
                    eventCellStyle={(event) => ({
                        backgroundColor:
                            event.stage === 'vegetative' ? '#68c690' :
                                event.stage === 'flowering' ? '#FFDC2E' :
                                    event.stage === 'fruiting' ? '#FF8D21' : 'grey',
                        borderRadius: 10,
                        padding: 5,
                        fontSize: 12,
                    })}
                />
            )}
            <View style={styles.viewMoreButton}>
                <TouchableOpacity
                // onPress={() => navigation.navigate('Gallery')}
                >
                    <Text style={styles.more}> View More</Text>
                </TouchableOpacity>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    navigationRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        paddingHorizontal: 10,
        marginTop: 5,
        borderWidth:2,
        borderColor:'grey'
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
    viewMoreButton: {
        alignItems: 'flex-end',
        paddingRight: 10,
        marginTop: 20,
    },
    more: {
        fontFamily: 'seric',
        fontSize: 20,
        backgroundColor: 'orange',
        color: '#fff',
        padding: 10,
        borderRadius: 8,
        marginBottom: 5
    },
    legendContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 15,
        marginTop: 15

    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 5,
    },

    v: {
        width: 20,
        height: 20,
        backgroundColor: '#68c690',
        marginRight: 5,
    },
    fl: {
        width: 20,
        height: 20,
        backgroundColor: '#FFDC2E',
        marginRight: 5,
    },
    fr: {
        width: 20,
        height: 20,
        backgroundColor: '#FF8D21',
        marginRight: 5,
    },
});

export default Timeline;
