import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions
} from 'react-native';

const windowWidth = Dimensions.get('window').width;

const Card = ({ imageSource, title, description, startDate, endDate, onPress, remarks}) => {
  const remarksColor = remarks
  ? remarks === 'failed'
    ? 'red'
    : remarks === 'On going'
      ? 'orange'
      : 'green'
  : 'green';
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <Image source={imageSource} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDescription}>{description}</Text>
        <Text style={styles.cardDate}>Date of Planting: {startDate}</Text>
        <Text style={styles.cardDate}>Date of Expected Harvest: {endDate}</Text>
        <Text style={[styles.cardRemarks, { color: remarksColor }]}>{remarks}</Text>
      </View>
    </TouchableOpacity>
  );
};

const TabView = ({ route, navigation, farms, imageUrls }) => {
  const handleCardPress = (farm) => {
    navigation.navigate("ProductionInput", { farm: farm });
  };

  function dateFormatter(date) {
    const d = new Date(date.toMillis());
    return d.toLocaleDateString();
  }

  return (
    <>
      {farms.length === 0 && Object.keys(imageUrls).length !== 0 ? (
        <View style={styles.loaderContainer}>
          <Text>Walang nakitang farm</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            {farms.map((farm) => (
              <Card
                key={farm.id}
                title={farm.title}
                description={`${farm.brgy}, ${farm.mun}`}
                startDate={dateFormatter(farm.start_date)}
                endDate={dateFormatter(farm.harvest_date)}
                remarks={farm.remarks}
                imageSource={imageUrls[farm.id] ? { uri: imageUrls[farm.id] } : require('../assets/p.jpg')}
                onPress={() => handleCardPress(farm)}
              />
            ))}
          </View>
        </ScrollView>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: 'green',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '90%',
    borderColor: 'green',
  },
  cardImage: {
    width: '100%',
    height: 120,
    borderRadius: 5,
    marginBottom: 10,
    resizeMode: 'cover',
  },
  cardContent: {
    flex: 1,
    alignItems: 'flex-start',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'green',
  },
  cardDescription: {
    fontSize: 16,
    lineHeight: 18,
    marginBottom: 10,
  },
  cardRemarks: {
    fontSize: 16,
    lineHeight: 18,
    textTransform:'uppercase',
    marginTop:5
  },
  cardDate: {
    fontSize: 12,
    lineHeight: 20,
  },
});

export default TabView;
