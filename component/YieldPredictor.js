import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, LogBox } from 'react-native';
import Pie from './Pie';
import { collection, getDocs } from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { db, auth } from '../firebase/Config';
import { ActivityIndicator } from 'react-native-paper';
import Timeline from './charts/Timeline';

const YieldPredictor = ({ route, navigation }) => {
    const userAuth = auth.currentUser

    const farmsColl = collection(db, 'farms');
    const [farmsData, farmsLoading, farmsError] = useCollectionData(farmsColl);

    const userColl = collection(db, '/users');
    const [usersData, usersLoading, usersError] = useCollectionData(userColl);

    const getPercentage = (pirsint, nambir) => {
        return Math.round((nambir / 100) * pirsint)
    }
    const format = (num) => {
        return num.toLocaleString('en-US'
        )
    }

    const getPieData = (activeFarms, key, colorFunc) => {
        const totalProduction = activeFarms.reduce((acc, farm) => {
            return parseInt(acc) + parseInt(farm.plantNumber);
        }, 0);
        console.log('total production:', totalProduction);

        const munTotalProduction = activeFarms.reduce((acc, farm) => {
            const keyValue = farm[key];

            if (keyValue) {
                // Check if the key already exists in acc
                if (acc[keyValue]) {
                    acc[keyValue] += parseInt(farm.plantNumber); // Add to the existing value
                } else {
                    acc[keyValue] = parseInt(farm.plantNumber); // Initialize the key with the value
                }
            }

            return acc;
        }, {});

        console.log("munTotal", munTotalProduction);

        return activeFarms.reduce((acc, farm) => {
            const keyExist = acc.find(item => item.name === farm[key]);
            const plantNumber = parseInt(farm.plantNumber);

            if (keyExist) {
                keyExist.value += plantNumber;
            } else {
                acc.push({
                    name: farm[key],
                    value: plantNumber,
                    text: `${Math.round((munTotalProduction[farm[key]] / totalProduction) * 100)}% (${format(munTotalProduction[farm[key]])})`,
                    color: colorFunc(farm[key]),
                });
            }
            return acc;
        }, []);
    };
    const colorList = [
        '#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9', '#BAE1FF',
        '#D4A5A5', '#FFD3B6', '#C9C9FF', '#E2F0CB', '#FFBEAA',
        '#FF9AA2', '#FFB7B2', '#FFDAC1', '#E0BBE4', '#D4A5A5',
        '#A0E7E5', '#B4F8C8', '#FFAEBC', '#AFCBFF', '#FFCECE',
        '#FFBCBC', '#FFD8D8', '#E1F7D5', '#FFFFD1', '#B2F7EF',
        '#FFC8A2', '#D3E4CD', '#F5E0B7', '#D2D7DF', '#FAD9C1',
        '#F3D1F4', '#E1E5EA', '#FFFCB6', '#BAED91', '#AED1E6',
        '#FFC6C6', '#FDFD96', '#B3B3FF', '#C4A3BF', '#C8E4EC',
        '#FFE5B4', '#FFCBF2', '#FFEEF2', '#D4E157', '#C6FFDD',
        '#F8BBD0', '#D3C1E5', '#C3FBD8', '#FAD1A5', '#CDE7B0'
    ];

    // Array to track used colors
    const usedColors = [];

    // Function to get a random color from the predefined list
    const getRandomColor = () => {
        if (usedColors.length >= colorList.length) {
            throw new Error("All colors have been used.");
        }

        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * colorList.length);
        } while (usedColors.includes(colorList[randomIndex]));

        // Mark this color as used
        usedColors.push(colorList[randomIndex]);
        return colorList[randomIndex];
    };

    const munColor = (mun) => {
        const colors = {

        }
        return colors[mun] || getRandomColor()
    }

    const brgyColor = (brgy) => {
        const colors = {

        }
        return colors[brgy] || getRandomColor()
    }

    return (
        <ScrollView>
            <View style={{ padding: 16, flex: 1, height: '100%', gap: 5 }}>
                <View style={{
                    backgroundColor: '#fff',
                    borderRadius: 12,
                    elevation: 5,
                    paddingTop:10,
                    paddingBottom:10
                }}>
                    {
                        farmsLoading
                            ? <ActivityIndicator />
                            : <Pie series={getPieData(farmsData.filter(f => f.cropStage !== 'complete'), 'mun', munColor)} title={"Camarines Norte QP Plantation (pcs)"} />
                    }
                </View>
                <View style={{
                    backgroundColor: '#fff',
                    borderRadius: 12,
                    elevation: 5,
                    marginTop: 18,
                    paddingTop:10,
                    paddingBottom:10
                }}>
                    {
                        farmsLoading && usersLoading
                            ? <ActivityIndicator />
                            : <Pie
                                series={getPieData(
                                    farmsData.filter(f => f.cropStage !== 'complete' && f.mun === usersData?.find(u => u.id === userAuth.uid)?.mun),
                                    'brgy',
                                    brgyColor
                                )}
                                title={`${usersData?.find(u => u.id === userAuth.uid)?.mun || 'Unknown'} Plantation QP (pcs)`}
                            />

                    }

                </View>
                <View style={{
                    backgroundColor: '#fff',
                    borderRadius: 12,
                    elevation: 5,
                    padding: 10,
                    marginTop: 18
                }}>
                    <Timeline navigation={navigation} />
                </View>
            </View>
        </ScrollView>
    );
};

export default YieldPredictor;
