import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, Modal, Button } from 'react-native';
import Pie from './Pie';  // Assume this is a custom Pie chart component
import { collection, getDocs } from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { db } from '../firebase/Config';
import { ActivityIndicator } from 'react-native-paper';
import { Agenda } from 'react-native-calendars';
import moment from 'moment';

const YieldPredictor = ({ route }) => {
    const [productionData, setProductionData] = useState([]);
    const [totalProduction, setTotalProduction] = useState(0);
    const [pieChartData, setPieChartData] = useState([]);
    const [combinedData2, setCombinedData2] = useState([]);
    const [roiData, setRoiData] = useState([]);

    const [items, setItems] = useState({
        '2024-10-23': [{ name: 'Meeting with client', time: '10:00 AM' }],
        '2024-10-23': [{ name: 'Team brainstorming session', time: '9:00 AM' }, { name: 'Project presentation', time: '2:00 PM' }, { name: 'Project presentation', time: '5:00 PM' }],
        '2024-10-01': [{ name: 'Team brainstorming session', time: '9:00 AM' }, { name: 'Project presentation', time: '2:00 PM' }],
        '2024-10-02': [{ name: 'Team brainstorming session', time: '9:00 AM' }, { name: 'Project presentation', time: '2:00 PM' }],
    });
  
    const renderEmptyData = () => {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>No events for this day</Text>
            </View>
        );
    };

    const farmsColl = collection(db, 'farms');
    const [farmsData, farmsLoading, farmsError] = useCollectionData(farmsColl);

    useEffect(() => {
        const fetchRoiData = async () => {
            if (!farmsData || farmsData.length === 0) return;

            let roiDataArray = [];
            for (const farm of farmsData) {
                if (!farm.id) {
                    console.error(`Farm is missing an id: ${JSON.stringify(farm)}`);
                    continue;
                }

                try {
                    const roiColl = collection(db, `farms/${farm.id}/roi`);
                    const roiSnapshot = await getDocs(roiColl);
                    roiSnapshot.forEach(doc => {
                        roiDataArray.push({
                            farmId: farm.id,
                            ...doc.data(),
                        });
                    });
                } catch (error) {
                    console.error(`Error fetching ROI data for farm ${farm.id}:`, error);
                }
            }

            setRoiData(roiDataArray);
        };

        fetchRoiData();
    }, [farmsData]);


    useEffect(() => {
        if (!farmsData || farmsData.length === 0 || roiData.length === 0) return;

        const groupedByBrgy = farmsData.reduce((acc, farm) => {
            const brgy = farm.brgy || 'Unknown Barangay';
            if (!acc[brgy]) acc[brgy] = [];

            const farmRoiData = roiData.find(data => data.farmId === farm.id);
            const grossReturn = farmRoiData?.grossReturn || 0;

            acc[brgy].push(grossReturn);
            return acc;
        }, {});

        const groupedByMun = farmsData.reduce((acc, farm) => {
            const mun = farm.mun || 'Unknown Municipality';
            if (!acc[mun]) acc[mun] = [];

            const farmRoiData = roiData.find(data => data.farmId === farm.id);
            const grossReturn = farmRoiData?.grossReturn || 0;

            acc[mun].push(grossReturn);
            return acc;
        }, {});

        const combinedData = Object.keys(groupedByBrgy).map(brgy => ({
            brgy,
            data: groupedByBrgy[brgy].reduce((sum, value) => sum + value, 0),
        }));

        const combinedData1 = Object.keys(groupedByMun).map(mun => ({
            mun,
            data: groupedByMun[mun].reduce((sum, value) => sum + value, 0),
        }));

        const pieChartData = combinedData.map((item) => ({
            label: item.brgy,
            value: item.data,
        }));

        const pieChartData1 = combinedData1.map((item) => ({
            label: item.mun,
            value: item.data,
        }));

        const totalProduction = combinedData1.reduce((sum, item) => sum + item.data, 0);
        const combinedData2 = combinedData1.map(item => ({
            label: item.mun,
            value: item.data,
        }));

        setProductionData(combinedData2);
        setTotalProduction(totalProduction);
        setPieChartData(pieChartData);
        setCombinedData2(combinedData2);
    }, [farmsData, roiData]);


    if (farmsLoading || roiData.length === 0) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator />
            </View>
        );
    }

    if (farmsError) {
        return <View><Text>Error loading data...</Text></View>;
    }

    const series1 = combinedData2.map(item => item.value);
    const labels1 = combinedData2.map(item => item.label);
    const series2 = pieChartData.map(item => item.value);
    const labels2 = pieChartData.map(item => item.label);

    return (
        <>
            <ScrollView>
                <View style={{ padding: 16, flex: 1, height: '100%', gap: 5 }}>
                    <View style={{
                        borderRadius: 20,
                        padding: 10,
                        // height:'100%'

                    }}>
                        <Agenda
                            items={items}
                            showOnlySelectedDayItems={true}
                            renderEmptyData={renderEmptyData}
                            renderItem={(item) => (
                                <View style={{ marginVertical: 10, marginTop: 30, backgroundColor: 'white', marginHorizontal: 10, padding: 10, }}>
                                    <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
                                    <Text>{item.time}</Text>
                                </View>
                            )}
                        />
                    </View>
                    <View style={{
                        backgroundColor: '#fff',
                        borderRadius: 20,
                        elevation: 5,
                        padding: 10,
                    }}>
                        <Pie labels={labels1} data={series1} title="Municipalities" />
                    </View>
                    <View style={{
                        backgroundColor: '#fff',
                        borderRadius: 20,
                        elevation: 5,
                        padding: 10,
                        marginTop: 20
                    }}>
                        <Pie labels={labels2} data={series2} title="Barangay" />
                    </View>
                </View>
            </ScrollView>

        </>
    );
};

export default YieldPredictor;
