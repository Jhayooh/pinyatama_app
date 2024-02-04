import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Button } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import GetLocation from 'react-native-get-location';

const YourMapComponent = () => {
  const [region, setRegion] = useState({
    latitude: 14.1390,
    longitude: 122.7633,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [userLocation, setUserLocation] = useState(null);

  const [markers, setMarkers] = useState([
    { latlng: { latitude: 14.1349, longitude: 122.6194 }, title: 'Marker 1', description: 'Description 1' },
    // Add more markers as needed
  ]);

  const onRegionChange = (newRegion) => {
    // Update the region when the user interacts with the map
    setRegion(newRegion);
  };

  const increaseZoom = () => {
    setRegion({
      ...region,
      latitudeDelta: region.latitudeDelta / 2,
      longitudeDelta: region.longitudeDelta / 2,
    });
  };

  const decreaseZoom = () => {
    setRegion({
      ...region,
      latitudeDelta: region.latitudeDelta * 2,
      longitudeDelta: region.longitudeDelta * 2,
    });
  };

  const getUserLocation = async () => {
    try {
      const location = await GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 60000,
      });

      setUserLocation(location);

      // Add a new marker at the user's location
      setMarkers((prevMarkers) => [
        ...prevMarkers,
        {
          latlng: { latitude: location.latitude, longitude: location.longitude },
          title: 'Your Location',
          description: 'You are here!',
        },
      ]);

      // Update the region to focus on the user's location
      setRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    } catch (error) {
      console.error('Error getting current location:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={region} onRegionChange={onRegionChange}>
        {userLocation && (
          <Marker
            coordinate={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            }}
            title="Your Location"
            description="You are here!"
            pinColor="blue" // Customize the pin color if needed
          />
        )}

        {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={marker.latlng}
            title={marker.title}
            description={marker.description}
          />
        ))}
      </MapView>
      <View style={styles.buttonContainer}>
        <Button title="Get Location" onPress={getUserLocation} />
        <Button title="Increase Zoom" onPress={increaseZoom} />
        <Button title="Decrease Zoom" onPress={decreaseZoom} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
});

export default YourMapComponent;
