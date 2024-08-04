import React from "react";
import { Text, View, TextInput } from "react-native";

//db
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { collection } from 'firebase/firestore';
import { db } from "../firebase/Config";

export const EditProfile = ({ navigation, route }) => {
    const { logUser } = route.params

    console.log('useeeerrrsss sa edit', logUser)

    return (
        <View>
            <View style={{ flexDirection: 'column', gap: 1, marginBottom: 20 }}>
                <Text >Name</Text>
                <TextInput
                    editable
                    placeholder={logUser.firstname}
                />
            </View>

        </View>
    )
}