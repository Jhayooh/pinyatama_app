import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React, { useState } from 'react';
import { ImageBackground, StyleSheet } from 'react-native';
import { SearchBar } from 'react-native-elements';
import Login from './Login';
import TabView from './TabView';
import Video from './Video';

const Tab = createMaterialTopTabNavigator();

export default function Gallery({ navigation }) {
  const [search, setSearch] = useState('');

  const updateSearch = (text) => {
    setSearch(text);
    // Perform search-related actions here, such as filtering data
    console.log('Search:', text);
  };

  return (
    <ImageBackground style={styles.background} >
      <SearchBar
        placeholder="Search"
        onChangeText={updateSearch}
        value={search}
        containerStyle={styles.searchContainer}
        inputContainerStyle={styles.searchInputContainer}
        inputStyle={styles.searchInput}
      />
      <Tab.Navigator 
        initialRouteName="Notifications"
        tabBarOptions={{
          activeTintColor: 'green',
          labelStyle: { fontSize: 11 },
          style: { backgroundColor: 'white' },
          fontWeight: 'bold',
        }}
      >
        <Tab.Screen
          name="Notifications"
          component={TabView}
          options={{ tabBarLabel: 'Lahat' }}
        />
        <Tab.Screen
          name="Profile"
          component={Video}
          options={{ tabBarLabel: 'Vegetative' }}
        />
        <Tab.Screen
          name="Notif"
          component={Video}
          options={{ tabBarLabel: 'Flowering' }}
        />
        <Tab.Screen
          name="Prof"
          component={Login}
          options={{ tabBarLabel: 'Fruiting' }}
        />
      </Tab.Navigator>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: 'white',
  },
  searchContainer: {
    backgroundColor: 'white',
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
    marginTop: 10,
   
    
  },
  searchInputContainer: {
    backgroundColor: '#f2f2f2',
    borderRadius: 20,
   
  },
  searchInput: {
    fontSize: 16,
  },
});
