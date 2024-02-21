import React, { useState } from 'react';
import { ImageBackground, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Card, SearchBar } from 'react-native-elements';

const Gallery = ({ navigation }) => {
  const [search, setSearch] = useState('');

  const updateSearch = (text) => {
    setSearch(text);
  };
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/brakrawnd.png')}
        style={styles.backgroundImage}
        blurRadius={5}
      >
        <View style={styles.overlay}>
          <SearchBar
            placeholder="Maghanap"
            onChangeText={updateSearch}
            value={search}
            containerStyle={styles.searchBarInputContainer}
            inputContainerStyle={styles.searchBarInputContainer}
          />
         <View>
      <ScrollView
        showsVerticalScrollIndicator={false}
      >
        <Card containerStyle={styles.cardContainer}>
          <Card.Image source={require('../assets/brakrawnd.png')} />
          <Text style={styles.cardText}>
            Pangalan ng Bukid
          </Text>
          <Text style={styles.cardText}>
            Location
          </Text>
          <Button
            buttonStyle={styles.cardButton}
            title='Ipakita ang Pagsusuri'
            titleStyle={{ color: 'black' }}
          />
        </Card>
        <Card containerStyle={styles.cardContainer}>
          <Card.Image source={require('../assets/brakrawnd.png')} />
          <Text style={styles.cardText}>
            Pangalan ng Bukid
          </Text>
          <Text style={styles.cardText}>
            Location
          </Text>
          <Button
            buttonStyle={styles.cardButton}
            title='Ipakita ang Pagsusuri'
            titleStyle={{ color: 'black' }}
          />
        </Card>
        <Card containerStyle={styles.cardContainer}>
          <Card.Image source={require('../assets/brakrawnd.png')} />
          <Text style={styles.cardText}>
            Pangalan ng Bukid
          </Text>
          <Text style={styles.cardText}>
            Location
          </Text>
          <Button
            buttonStyle={styles.cardButton}
            title='Ipakita ang Pagsusuri'
            titleStyle={{ color: 'black' }}
          />
        </Card>
      </ScrollView>
    </View>
        </View>
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
