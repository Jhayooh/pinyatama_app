import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const CardView = ({ imageSource, title, description, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} style={styles.card}>
            <Image source={{ uri: imageSource }} style={styles.cardImage} />
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{title}</Text>
                <Text style={styles.cardDescription}>{description}</Text>
            </View>
        </TouchableOpacity>
    );
};
const Vegetitive = ({ navigation }) => {
    const handleCardPress = () => {
        console.log('Card pressed!');
    };

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.container}>
                <CardView
                    imageSource='../assets/pine.jpg'
                    title="Card Title"
                    description="This is the example of React Native Card view. This is the easiest way to adding a card view on your screen."
                    onPress={handleCardPress}
                />
                <CardView
                    imageSource="pinya.png"
                    title="Card Title"
                    description="This is the example of React Native Card view. This is the easiest way to adding a card view on your screen."
                    onPress={handleCardPress}
                />
                <CardView
                    imageSource="pinya.png"
                    title="Card Title"
                    description="This is the example of React Native Card view. This is the easiest way to adding a card view on your screen."
                    onPress={handleCardPress}
                />
                <CardView
                    imageSource="pinya.png"
                    title="Card Title"
                    description="This is the example of React Native Card view. This is the easiest way to adding a card view on your screen."
                    onPress={handleCardPress}
                />
            </View>
        </ScrollView>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    card: {
        marginTop: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        width: '90%',
        alignItems: 'center',
        borderColor: '#206830'
    },
    cardImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginRight: 20,
        marginTop: 10,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    cardDescription: {
        fontSize: 16,
        lineHeight: 24,
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
    },

});
export default Vegetitive