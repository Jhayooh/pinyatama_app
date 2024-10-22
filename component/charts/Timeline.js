import { Text, Button, View } from 'react-native'
import { Calendar } from 'react-native-big-calendar'
import dayjs from 'dayjs'
import { useState } from 'react'
import { db, auth } from '../../firebase/Config'
import { addDoc, collection } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";

const Timeline = () => {
    const farmsColl = collection(db, `/farms`)
    const [farms] = useCollectionData(farmsColl)

    const user = auth.currentUser
    
    const today = new Date()
    const events = [
        {
            title: 'Meeting',
            start: new Date(2024, 9, 22, 10, 0),
            end: new Date(2024, 9, 29, 10, 30),
        },
        {
            title: 'Coffee break',
            start: new Date(2024, 9, 22, 15, 45),
            end: new Date(2024, 9, 25, 16, 30),
        },
    ]

    const [date, setDate] = useState(today)
    const [mode, setMode] = useState('month')

    const _onToday = () => {
        setDate(today)
    }

    const _onPrevDate = () => {
        if (mode === 'month') {
            setDate(
                dayjs(date)
                    .add(dayjs(date).date() * -1, 'day')
                    .toDate(),
            )
        }

    }

    const _onNextDate = () => {
        setDate(dayjs(date).add(1, 'month').toDate());
    }

    farms && console.log("faaarmsss", farms
        .filter(f => f.brgyUID === user.uid)
        .map(f => ({
            start: new Date(f.start_date.toDate()),
            end: new Date(f.harvest_date.toDate()),
            title: f.title,
            uid: f.brgyUID
        })))

    return (
        <>
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', flex: 1, gap: 8 }}>
                <Button title='<' onPress={_onPrevDate} />
                <Button title='Today' onPress={_onToday} />
                <View style={{ marginLeft: 4, flex: 1 }}>
                    <Text style={{ fontWeight: 600 }}>{dayjs(date).format('MMMM YYYY')}</Text>
                </View>
                <Button title='>' onPress={_onNextDate} />
            </View>
            {
                farms &&
                <Calendar
                    date={date}
                    events={
                        farms
                            .filter(f => f.brgyUID === user.uid)
                            .map(f => ({
                                start: new Date(f.start_date.toDate()),
                                end: new Date(f.harvest_date.toDate()),
                                title: f.title
                            }))
                    }
                    height={500}
                    mode={mode}
                />
            }
        </>
    )
}

export default Timeline