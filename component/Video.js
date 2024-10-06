import React from 'react';
import { ImageBackground, ScrollView, StyleSheet, Text, View, } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';

const Video = ({ navigation }) => {
    return (
        // <ImageBackground source={require('../assets/p1.jpg')} style={styles.background} >
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.videoContainer}>
                    <VideoCard title="Pagaani ng Pinya sa Labo, Camarines Norte "  videoId="oS5xvukokSw" />
                    <VideoCard title="Semilya ng Pinya, Daet, Camarines Norte" videoId="K9WfCeUL4AM" />
                    <VideoCard title="The sweetest Pineapple in Camarines Norte" videoId="gCCu6xwi2f4" />
                </View>
            </ScrollView>
        // </ImageBackground>
    );
};

const VideoCard = ({ title, videoId, subtitle }) => {
    return (
        <View style={styles.card}>
            <YoutubePlayer height={250} videoId={videoId} />
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover',
    },
    videoContainer: {
        padding: 20,
        marginTop:20
        
    },
    card: {
        marginBottom: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        shadowColor: 'green',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,

    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
      
    },
    subtitle: {
        fontSize: 10,
    }

});

export default Video;
