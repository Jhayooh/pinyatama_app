import React from 'react';
import { ImageBackground, ScrollView, StyleSheet, Text, View, subtitle } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';

const Video = ({ navigation }) => {
    return (
        <ImageBackground source={require('../assets/brakrawnd.png')} style={styles.background} >
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.videoContainer}>
                    <VideoCard title="Pagaani ng Pinya sa Labo, Camarines Norte "  subtitle="This is a subtitle" videoId="oS5xvukokSw" />
                    <VideoCard title="Semilya ng Pinya, Daet, Camarines Norte" subtitle="This is a subtitle" videoId="K9WfCeUL4AM" />
                    <VideoCard title="The sweetest Pineapple in Camarines Norte"  subtitle="This is a subtitle" videoId="gCCu6xwi2f4" />
                </View>
            </ScrollView>
        </ImageBackground>
    );
};

const VideoCard = ({ title, videoId }) => {
    return (
        <View style={styles.card}>
            <Text style={styles.title}>{title}</Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
            <YoutubePlayer height={300} videoId={videoId} />
        </View>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: '#247027',
    },
    videoContainer: {
        padding: 20,
        
    },
    card: {
        marginBottom: 20, 
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#555',
        marginBottom: 5,
    },
});

export default Video;
