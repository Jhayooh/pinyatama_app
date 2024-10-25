import { Text, Button, View, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-big-calendar';
import dayjs from 'dayjs';
import { useState } from 'react';
import { db, auth } from '../../firebase/Config';
import { collection } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";


const Timeline = ({navigation}) => {
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
            <View style={styles.navigationRow}>
                <Button color="grey" title="<" onPress={_onPrevDate} />
                <Text style={styles.monthTitle}>{dayjs(date).format('MMMM YYYY')}</Text>
                <Button color="grey" title=">" onPress={_onNextDate} />
            </View>

            <View style={styles.todayButton}>
                <Button color="orange" title="Today" onPress={_onToday} />
            </View>

            <View style={styles.viewMoreButton}>
                <Button title="View More" />
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
                            event.stage === 'vegetative' ? 'green' :
                            event.stage === 'flowering' ? 'yellow' :
                            event.stage === 'fruiting' ? 'orange' : 'grey',
                        borderRadius: 10,
                        padding: 5,
                        fontSize: 12,
                    })}
                />
            )}

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
    },
    monthTitle: {
        fontWeight: '700',
        fontSize: 20,
        fontFamily: 'serif',
        textAlign: 'center',
        flex: 1,
    },
    todayButton: {
        marginVertical: 10,
        alignItems: 'center',
        flex:1
    },
    viewMoreButton: {
        alignItems: 'flex-end',
        marginVertical: 10,
        paddingRight: 10,
    },
    legendContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 5,
    },
    v: {
        width: 20,
        height: 20,
        backgroundColor: 'green',
        marginRight: 5,
    },
    fl: {
        width: 20,
        height: 20,
        backgroundColor: 'yellow',
        marginRight: 5,
    },
    fr: {
        width: 20,
        height: 20,
        backgroundColor: 'orange',
        marginRight: 5,
    },
});

export default Timeline;
