import React, { useState } from 'react';
import { SearchBar, Card, Button, Icon } from 'react-native-elements';
import { View, Text, Image, ImageBackground, StyleSheet, Platform, ScrollView } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

const Gallery = ({ navigation }) => {
  const [search, setSearch] = useState('');

  const updateSearch = (text) => {
    setSearch(text);
  };

  const Screen1 = () => (
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
            buttonStyle={styles.cardButton} onPress={()  => {
              navigation.navigate('ProductionInput')
            }}
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
  );

  const Screen2 = () => (
    <View >
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
      </ScrollView>
    </View>
  );

  const Screen3 = () => (
    <View >
      <Text>Screen 3</Text>
    </View>
  );
  const Screen4 = () => (
    <View >
      <Text>Screen 2</Text>
    </View>
  );

  const Screen5 = () => (
    <View >
      <Text>Screen 3</Text>
    </View>
  );
  const Screen6 = () => (
    <View >
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
      </ScrollView>
    </View>
  );

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
            containerStyle={styles.searchBarContainer}
            inputContainerStyle={styles.searchBarInputContainer}
          />
          <Tab.Navigator style={styles.Tab}>
            <Tab.Screen name="Lahat" component={Screen1} />
            <Tab.Screen name="0 buwan" component={Screen2} />
            <Tab.Screen name="6 buwan" component={Screen3} />
            <Tab.Screen name="12 buwan" component={Screen4} />
            <Tab.Screen name="18 buwan" component={Screen5} />
            <Tab.Screen name="Aanihin" component={Screen6} />
          </Tab.Navigator>
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
  searchBarContainer: {
    backgroundColor: 'transparent',
    borderTopWidth: 20,
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
  Tab: {
    position: 'absolute',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: 'transparent',
  }

});

export default Gallery;
