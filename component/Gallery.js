import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React, { useState } from 'react';
import { ImageBackground, StyleSheet } from 'react-native';
import { SearchBar } from 'react-native-elements';
import TabView from './TabView';

const Tab = createMaterialTopTabNavigator();

export default function Gallery({ navigation }) {
  const [search, setSearch] = useState('');

  const updateSearch = (text) => {
    setSearch(text);
    
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
          name="Vegetitive"
          component={TabView}
          options={{ tabBarLabel: 'Vegetative' }}
        />
        <Tab.Screen
          name="Flowering"
          component={TabView}
          options={{ tabBarLabel: 'Flowering' }}
        />
        <Tab.Screen
          name="Fruiting"
          component={TabView}
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
    backgroundColor: 'green',
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
    padding:20
 
  },
  searchInputContainer: {
    backgroundColor: '#f2f2f2',
    borderRadius: 20,
    borderColor: 'green'
   
  },
  searchInput: {
    fontSize: 16,
  },
});
