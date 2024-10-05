import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text } from 'react-native';
import Pie from './Pie';
import { collection, getDocs } from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { db } from '../firebase/Config';
import { ActivityIndicator } from 'react-native-paper';

const YieldPredictor = () => {
    const [productionData, setProductionData] = useState([]);
    const [totalProduction, setTotalProduction] = useState(0);
    const [pieChartData, setPieChartData] = useState([]);
    const [combinedData2, setCombinedData2] = useState([]);
    const [roiData, setRoiData] = useState([]); // State to store ROI data


    // Fetch farms data from Firestore
    const farmsColl = collection(db, 'farms');
    const [farmsData, farmsLoading, farmsError] = useCollectionData(farmsColl);

    // Fetch ROI data for each farm
    useEffect(() => {
        const fetchRoiData = async () => {
            if (!farmsData || farmsData.length === 0) return;

            let roiDataArray = [];
            for (const farm of farmsData) {
                // Ensure each farm has an id
                if (!farm.id) {
                    console.error(`Farm is missing an id: ${JSON.stringify(farm)}`);
                    continue;
                }

                // Dynamically fetch the ROI sub-collection for each farm
                try {
                    const roiColl = collection(db, `farms/${farm.id}/roi`);
                    const roiSnapshot = await getDocs(roiColl);  // getDocs to fetch sub-collection

                    // Assuming only one document exists in the roi sub-collection
                    roiSnapshot.forEach(doc => {
                        roiDataArray.push({
                            farmId: farm.id,
                            ...doc.data(), // Spread the roi data (including grossReturn)
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
        if (!farmsData || farmsData.length === 0 || roiData.length === 0) {
            return;
        }

        // Group farms by title and municipality (mun)
        const groupedByTitle = farmsData.reduce((acc, farm) => {
            const title = farm.title || 'Unknown Title';
            if (!acc[title]) acc[title] = [];

            // Find the ROI data for this farm
            const farmRoiData = roiData.find(data => data.farmId === farm.id);
            const grossReturn = farmRoiData?.grossReturn || 0;

            acc[title].push(grossReturn);
            return acc;
        }, {});

        const groupedByMun = farmsData.reduce((acc, farm) => {
            const mun = farm.mun || 'Unknown Municipality';
            if (!acc[mun]) acc[mun] = [];

            // Find the ROI data for this farm
            const farmRoiData = roiData.find(data => data.farmId === farm.id);
            const grossReturn = farmRoiData?.grossReturn || 0;

            acc[mun].push(grossReturn);
            return acc;
        }, {});

        // Combine data based on the grouping
        const combinedData = Object.keys(groupedByTitle).map(title => ({
            title,
            data: groupedByTitle[title].reduce((sum, value) => sum + value, 0),
        }));

        const combinedData1 = Object.keys(groupedByMun).map(mun => ({
            mun,
            data: groupedByMun[mun].reduce((sum, value) => sum + value, 0),
        }));

        // Create pie chart data for farms
        const pieChartData = combinedData.map((item) => ({
            label: item.title,
            value: item.data,
        }));

        // Create pie chart data for municipalities
        const pieChartData1 = combinedData1.map((item) => ({
            label: item.mun,
            value: item.data,
        }));

        // Total production and formatted data for municipalities
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

    // Prepare series and labels for the Pie charts
    const series1 = combinedData2.map(item => item.value);
    const labels1 = combinedData2.map(item => item.label);
    const series2 = pieChartData.map(item => item.value);
    const labels2 = pieChartData.map(item => item.label);

    console.log('serrriees1', series1)
    console.log('l1', labels1)
    console.log('serrriees2', series2)
    console.log('l2', labels2)

    if (farmsLoading || roiData.length === 0) {
        return <View style={{flex:1, justifyContent:'center', alignItems:'center',}}>
            <ActivityIndicator />
        </View>;
    }

    if (farmsError) {
        return <View><Text>Error loading data...</Text></View>;
    }

    return (
        <ScrollView>
            <View style={{ padding: 16, flex: 1, height: '100%' }}>
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
                    marginTop:20
                }}>
                    <Pie labels={labels2} data={series2} title="Farms" />
                </View>
            </View>
        </ScrollView>
    );
};

export default YieldPredictor;
