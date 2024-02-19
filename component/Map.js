import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Button, PermissionsAndroid } from 'react-native';
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

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app needs access to your location to show it on the map.',
          buttonPositive: 'OK',
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Location permission granted');
      } else {
        console.log('Location permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
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
      <MapView style={styles.map} region={region}>
        {userLocation && (
          <Marker
            coordinate={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            }}
            title="Your Location"
            description="You are here!"
            pinColor="blue"
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
});

export default YourMapComponent;
