import React, { useState } from 'react';
import { ImageBackground, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';

function FarmGal() {
  return (
    <View>
      
    </View>
  )
}

function Lahat() {

}

function Buwan0() {

}

function Buwan6() {

}

function Buwan12(params) {

}

function Buwan18(params) {

}

function Aanihin() {

}

const renderScene = SceneMap({
  lahat: Lahat,
  buwan0: Buwan0,
  buwan6: Buwan6,
  buwan12: Buwan12,
  buwan18: Buwan18,
  aanihin: Aanihin,
});


const Gallery = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [index, setIndex] = React.useState(0);
  const [routes] = useState([
    { key: 'lahat', title: 'Lahat' },
    { key: 'buwan0', title: 'Buwan0' },
    { key: 'buwan6', title: 'Buwan6' },
    { key: 'buwan12', title: 'Buwan12' },
    { key: 'buwan18', title: 'Buwan18' },
    { key: 'aanihin', title: 'Aanihin' },
  ]);

  const updateSearch = (text) => {
    setSearch(text);
  };


  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/brakrawnd.png')}
        style={styles.backgroundImage}
      >
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
        />
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent', // Adjust the opacity here
    padding: 20,
  },

  searchBarInputContainer: {
    backgroundColor: 'white',
  },
  cardContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    borderRadius: 10,

  },
  cardText: {
    marginBottom: 10,
    color: 'black',
    fontFamily: Platform.OS === 'android' ? 'Roboto' : undefined,

  },
  cardButton: {
    borderRadius: 0,
    marginLeft: 50,
    marginRight: 0,
    marginBottom: 0,
    backgroundColor: 'white',
  },

});

export default Gallery;
