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
        // <ImageBackground source={require('../assets/p1.jpg')} style={styles.cover}>
        <View style={styles.white}>
            <Image source={appLogo} style={styles.appLogo} />
            <Text style={styles.appTitle} >Queen Pineapple Farming</Text>
            <Text style={styles.text}>
                <Text style={styles.innerText}>
                    Ang
                    <Text style={styles.title}> Queen Pineapple Farming App </Text>

                    <Text style={styles.innerText}>
                        ay isang makabagong digital na solusyon
                        na dinisenyo upang tugunan ang problema ng over at under supply ng
                        pinya sa bayan ng Daet, Camarines Norte. Layunin ng app na ito na makatulong
                        sa mga lokal na magsasaka ng pinya sa pamamagitan ng pagbibigay ng detalyadong
                        impormasyon na makatutulong sa mas mahusay na pamamahala ng kanilang sakahan.
                        Sa loob ng app, makikita ang iskedyul ng pagtatanim at pag-ani ng bawat sakahan,
                        pati na rin ang mapa ng kanilang mga lokasyon, na nagbibigay ng malinaw na overview ng sitwasyon sa produksyon.
                        {'\n'}
                        {'\n'}
                        Higit pa rito, binibigyan ng app ang mga magsasaka ng mga datos ukol sa inaasahang
                        produksyon ng kanilang mga sakahan at ang potensyal na kita mula sa mga ito. Sa ganitong paraan,
                        matutulungan ang mga magsasaka na masubaybayan ang kanilang produksyon at maiwasan ang labis na suplay
                        o kakulangan ng pinya sa merkado. Nagiging gabay ito upang mapanatili ang balanse ng supply at demand,
                        na may direktang epekto sa ekonomiya ng lugar. Ito ay isang mahalagang hakbang tungo
                        sa modernong pamamahala ng agrikultura, gamit ang teknolohiya upang mapabuti ang ani at kita ng mga magsasaka sa Daet.
                    </Text>
                </Text>
            </Text>

        </View>
        // </ImageBackground>
    )
}
const styles = StyleSheet.create({
    cover: {
        flex: 1,
        resizeMode: "cover",
        alignContent: 'center'
    },
    white: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 20,
        elevation: 5,
        margin: 20,
        marginTop: 50,
    },
    appLogo: {
        width: 128 ,
        height: '20%',
        padding: 12,
        alignItems: 'center',
        alignContent: 'center',
        marginLeft: 100,
        marginBottom: 20
    },
    appTitle: {
        fontSize:30,
        color: 'green',
        fontWeight: '600',
        textAlign: 'center',
        fontFamily: 'serif',
        paddingBottom: 10
    },
    title: {
        color: 'red'
    },
    innerText: {
        color: 'black'
    },
    text: {
        fontFamily: 'serif',
        fontSize: 16,
        textAlign:'justify',
        letterSpacing:.5

    }
})
export default About 