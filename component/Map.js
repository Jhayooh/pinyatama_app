import React, { useState } from 'react';
import { View, StyleSheet, Button } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const YourMapComponent = () => {
  const [region, setRegion] = useState({
    latitude: 14.1390,
                longitude: 122.7633,
                latitudeDelta: 0.6922,
                longitudeDelta: 0.6421,
  });

  const [markers, setMarkers] = useState([
    { latlng: { latitude: 14.1349, longitude: 122.6194 }, title: 'Marker 1', description: 'Description 1' },
    // Add more markers as needed
  ]);

  const onRegionChange = newRegion => {
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

  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={region} onRegionChange={onRegionChange}>
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
