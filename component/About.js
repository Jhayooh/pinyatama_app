import React from 'react';
import {
    Image,
    ImageBackground,
    StyleSheet,
    Text,
    View
} from 'react-native';
import appLogo from '../assets/pinyatamap-logo.png';
const About = ({ navigation }) => {
    return (
        <ImageBackground source={require('../assets/p1.jpg')} style={styles.cover}>
            <View style={styles.white}>
            <Image source={appLogo} style={styles.appLogo} />
                <Text> Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</Text>
            </View>
        </ImageBackground>
    )
}
const styles = StyleSheet.create({
    cover: {
        flex: 1,
        resizeMode: "cover",
        alignContent: 'center'
    },
    white:{
        flex:1,
        padding: 20,
        backgroundColor: '#fff',
        borderRadius:20,
        elevation:5,
        margin:20,
        marginTop:50
    },
    appLogo: {
        width: 128,
        height: 128,
        padding: 12,
        alignItems:'center',
        alignContent:'center',
        marginLeft:100,
        marginBottom:20
    },
})
export default About 