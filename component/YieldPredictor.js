import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, LogBox } from 'react-native';
import Pie from './Pie';  // Assume this is a custom Pie chart component
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

    // {
    //     name: "Seoul",
    //     population: 21500000,
    //     color: "rgba(131, 167, 234, 1)",
    //     legendFontColor: "#7F7F7F",
    //     legendFontSize: 15
    //   },
    // {
    //     name: "Toronto",
    //     population: 2800000,
    //     color: "#F00",
    //     legendFontColor: "#7F7F7F",
    //     legendFontSize: 15
    //   },

    const getPieData = (activeFarms, key, colorFunc) => {
        return activeFarms.reduce((acc, farm) => {
            const keyExist = acc.find(item => item.name === farm[key]);
            const plantNumber = parseInt(farm.plantNumber);

            if (keyExist) {
                keyExist.population += plantNumber;
            } else {
                acc.push({
                    name: farm[key],
                    population: plantNumber,
                    color: colorFunc(farm[key]),
                    legendFontColor: "#7F7F7F",
                    legendFontSize: 15
                });
            }
            return acc;
        }, []);
    };
    const colorList = [
        '#FF6700',
        '#FFB000',
        '#FFE600',
        '#7FDD05',
        '#00A585',
        '#22BCF2',
        '#1256CC',
        '#803AD0',
        '#B568F2',
        '#CC2782',
        '#FF71BF',
        '#7EE8C7'
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
                    padding: 10,
                }}>
                    {
                        farmsLoading
                            ? <ActivityIndicator />
                            : <Pie series={getPieData(farmsData.filter(f => f.cropStage !== 'complete'), 'mun', munColor)} title={"Municipality"} />
                    }
                </View>
                <View style={{
                    backgroundColor: '#fff',
                    borderRadius: 12,
                    elevation: 5,
                    padding: 10,
                    marginTop: 18
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
                                title={"Barangays"}
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
