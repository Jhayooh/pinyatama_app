import React, { useState } from 'react';
import { ImageBackground, Platform, StyleSheet, View } from 'react-native'; // Added Image import

export default function TabView({ navigation }) {
  const [search, setSearch] = useState('');

  const updateSearch = (text) => {
    setSearch(text);
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/brakrawnd.png')}
        style={styles.backgroundImage}
        blurRadius={5} />
        <TabView
           navigationState={{ index, routes }}
           renderScene={(props) => renderScene({ ...props, navigation })}
           onIndexChange={setIndex}
       />
        
      
    </View>
  );
}

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
    backgroundColor: 'transparent',
  },
  searchBarInputContainer: {
    backgroundColor: 'white',
  },
  cardContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    borderRadius: 10,
  },
  cardImage: {
    height: 200, // Adjust height as needed
    resizeMode: 'cover',
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
