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
  const { farms = [], user } = route.params

  const [filteredFarms, setFilteredFarms] = useState(farms)

  const handleSearch = (text) => {
    setSearch(text);
    console.log("text:", text)
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
    const filteredFarms = farms.filter((farm) => {
      let matchesMunicipality = farm;
      let matchesBrgy = farm;

      if (user) {
        matchesMunicipality = user.mun ? farm.mun === user.mun : true;
        matchesBrgy = user.brgy ? farm.brgy === user.brgy : true;
      }
      const matchesSearch = farm.title.toLowerCase().includes(search.toLowerCase());
      return matchesSearch && matchesMunicipality && matchesBrgy
    })

    setFilteredFarms(filteredFarms)
    console.log("filtered farmsssss", filteredFarms);
  }, [search, farms])

  useEffect(() => {
    async function fetchImageUrls() {
      if (!filteredFarms) return
      const urls = {};
      for (const marker of filteredFarms) {
        const url = await getImage(marker.id);
        if (url) {
          urls[marker.id] = url;
        }
      }
      setImageUrls(urls);
    }
    fetchImageUrls();
  }, [filteredFarms]);

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
      {filteredFarms && Object.keys(imageUrls).length !== 0 &&
        <Tab.Navigator
          initialRouteName="Lahat"
          tabBarOptions={{
            activeTintColor: 'green',
            labelStyle: { fontSize: 11 },
            style: { backgroundColor: 'white' },
            fontWeight: 'bold',
          }}
        >
          <Tab.Screen
            name="Lahat"
            // component={TabView}
            // options={{ tabBarLabel: 'Lahat' }}
            // setParams={{
            //   farms: filteredFarms,
            //   imageUrls: imageUrls,
            // }}
            children={props => (
              <TabView {...props} farms={filteredFarms} imageUrls={imageUrls} />
            )}

          />

          <Tab.Screen
            name="Vegetative"
            // component={TabView}
            // options={{ tabBarLabel: 'Vegetative' }}
            // initialParams={{
            //   farms: filteredFarms.filter(obj =>
            //     obj.cropStage.toLowerCase() === 'vegetative'
            //   ),
            //   imageUrls: imageUrls
            // }}
            children={props => (
              <TabView {...props} farms={filteredFarms.filter(obj => obj.cropStage.toLowerCase() === 'vegetative')} imageUrls={imageUrls} />
            )}
          />
          <Tab.Screen
            name="Flowering"
            // component={TabView}
            // options={{ tabBarLabel: 'Flowering' }}
            // initialParams={{
            //   farms: filteredFarms.filter(obj =>
            //     obj.cropStage.toLowerCase() === 'flowering'
            //   ),
            //   imageUrls: imageUrls
            // }}
            children={props => (
              <TabView {...props} farms={filteredFarms.filter(obj => obj.cropStage.toLowerCase() === 'flowering')} imageUrls={imageUrls} />
            )}
          />
          <Tab.Screen
            name="Fruiting"
            // component={TabView}
            // options={{ tabBarLabel: 'Fruiting' }}
            // initialParams={{
            //   farms: filteredFarms.filter(obj =>
            //     obj.cropStage.toLowerCase() === 'fruiting'
            //   ),
            //   imageUrls: imageUrls
            // }}
            children={props => (
              <TabView {...props} farms={filteredFarms.filter(obj => obj.cropStage.toLowerCase() === 'fruiting')} imageUrls={imageUrls} />
            )}
          />
          <Tab.Screen
            name="Complete"
            // component={TabView}
            // options={{ tabBarLabel: 'Archive' }}
            // initialParams={{
            //   farms: filteredFarms.filter(obj =>
            //     obj.cropStage.toLowerCase() === 'complete'
            //   ),
            //   imageUrls: imageUrls
            // }}
            children={props => (
              <TabView {...props} farms={filteredFarms.filter(obj => obj.cropStage.toLowerCase() === 'complete')} imageUrls={imageUrls} />
            )}
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
