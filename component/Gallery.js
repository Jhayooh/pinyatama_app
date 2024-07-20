import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React, { useState, useEffect } from 'react';
import { ImageBackground, StyleSheet } from 'react-native';
import { SearchBar } from 'react-native-elements';
import TabView from './TabView';
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/Config';

//image
import Default from '../assets/p.jpg'

const Tab = createMaterialTopTabNavigator();

export default function Gallery({ route }) {
  const [search, setSearch] = useState('');
  const [imageUrls, setImageUrls] = useState({});
  const { farms = [] } = route.params

  const handleSearch = (text) => {
    setSearch(text);
  };

  async function getImage(id) {
    try {
      const listRef = ref(storage, `FarmImages/${id}`);
      const result = await listAll(listRef);
      const downloadUrl = await getDownloadURL(result.items[0])
      return downloadUrl
    } catch (error) {
      console.error('Error fetching images: ', error);
    }
  }

  useEffect(() => {
    async function fetchImageUrls() {
      if (!farms) return
      const urls = {};
      for (const marker of farms) {
        const url = await getImage(marker.id);
        if (url) {
          urls[marker.id] = url;
        }
      }
      setImageUrls(urls);
    }
    fetchImageUrls();
  }, [farms]);

  return (
    <ImageBackground style={styles.background} >
      <SearchBar
        placeholder="Maghanap..."
        onChangeText={handleSearch}
        value={search}
        containerStyle={styles.searchContainer}
        inputContainerStyle={styles.searchInputContainer}
        inputStyle={styles.searchInput}
      />
      {farms && Object.keys(imageUrls).length !== 0 &&
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
            initialParams={{
              farms: farms,
              imageUrls: imageUrls 
            }}
            
          />

          <Tab.Screen
            name="Vegetative"
            component={TabView}
            options={{ tabBarLabel: 'Vegetative' }}
            initialParams={{
              farms: farms.filter(obj =>
                obj.cropStage.toLowerCase() === 'vegetative'
              ),
              imageUrls: imageUrls
            }}
          />
          <Tab.Screen
            name="Flowering"
            component={TabView}
            options={{ tabBarLabel: 'Flowering' }}
            initialParams={{
              farms: farms.filter(obj =>
                obj.cropStage.toLowerCase() === 'flowering'
              ),
              imageUrls: imageUrls
            }}
          />
          <Tab.Screen
            name="Fruiting"
            component={TabView}
            options={{ tabBarLabel: 'Fruiting' }}
            initialParams={{
              farms: farms.filter(obj =>
                obj.cropStage.toLowerCase() === 'fruiting'
              ),
              imageUrls: imageUrls
            }}
          />
          <Tab.Screen
            name="Archive"
            component={TabView}
            options={{ tabBarLabel: 'Archive' }}
            initialParams={{
              farms: farms.filter(obj =>
                obj.cropStage.toLowerCase() === 'complete'
              ),
              imageUrls: imageUrls
            }}
          />
        </Tab.Navigator>
      }
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: 'white',
  },
  searchContainer: {
    backgroundColor: '#4DAF50',
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
