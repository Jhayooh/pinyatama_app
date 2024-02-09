import React, { useState } from 'react';
import { SearchBar, Card, Button, Icon } from 'react-native-elements'; 
import { View, Text, Image, ImageBackground, StyleSheet, Platform } from 'react-native';


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
      blurRadius={5} // Adjust the blur radius as needed
    >
      <View style={styles.overlay}>
        <SearchBar
          placeholder="Maghanap"
          onChangeText={updateSearch}
          value={search}
          containerStyle={styles.searchBarContainer}
          inputContainerStyle={styles.searchBarInputContainer}
        />
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
            title='Ipakita ang Pagsusuri'titleStyle={{ color: 'black' }}
          />
        </Card>
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
        backgroundColor: 'rgba(0, 0, 0, 0.1)', // Adjust the opacity here
        padding: 20,
      },
      searchBarContainer: {
        backgroundColor: 'transparent',
        borderTopWidth: 0,
        borderBottomWidth: 0,
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
    color: 'white',
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