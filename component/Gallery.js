import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React, { useState } from 'react';
import { ImageBackground, StyleSheet } from 'react-native';
import { SearchBar } from 'react-native-elements';
import TabView from './TabView';

const Tab = createMaterialTopTabNavigator();

export default function Gallery({ route, navigation }) {
  const [search, setSearch] = useState('');
  const { farms = [] } = route.params

  console.log("farms sa gallery", farms);

  const updateSearch = (text) => {
    setSearch(text);
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
          initialParams={farms && {
            farms: farms
          }}
        />
        <Tab.Screen
          name="Vegetative"
          component={TabView}
          options={{ tabBarLabel: 'Vegetative' }}
          initialParams={{
            farms: farms && farms.filter(obj =>
              obj.cropStage.toLowerCase() === 'vegetative'
            )
          }}
        />
        <Tab.Screen
          name="Flowering"
          component={TabView}
          options={{ tabBarLabel: 'Flowering' }}
          initialParams={{
            farms: farms && farms.filter(obj =>
              obj.cropStage.toLowerCase() === 'flowering'
            )
          }}
        />
        <Tab.Screen
          name="Fruiting"
          component={TabView}
          options={{ tabBarLabel: 'Fruiting' }}
          initialParams={{
            farms: farms && farms.filter(obj =>
              obj.cropStage.toLowerCase() === 'fruiting'
            )
          }}
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
    padding: 20

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
