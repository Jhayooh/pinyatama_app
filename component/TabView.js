import React from 'react';
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';


const Card = ({ imageSource, title, description, startDate, endDate, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <Image source={{uri: imageSource}} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDescription}>{description}</Text>
        <Text style={styles.cardDate}> Date of Planting: {startDate}  </Text>
        <Text style={styles.cardDate}> Date of Harvest: {endDate}  </Text>

        
     
      </View>
    </TouchableOpacity>
  );
};

const TabView = ({ route, navigation }) => {
  const { farms = [], imageUrls = {} } = route.params;
  const farm = farms[0]

  const handleCardPress = (farm) => {
    navigation.navigate("ProductionInput", { farms: [farm] })
  };

  function dateFormatter(date) {
    const d = new Date(date.toMillis())
    return d.toLocaleDateString()
  }

  return (
    <>
      {
        farms.length === 0 && Object.keys(imageUrls).length != 0
          ?
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator />
          </View>
          :
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.container}>
              {farms.map((farm) => (
                <Card
                  key={farm.id}
                  title={farm.title}
                  description={` ${farm.brgy}, ${farm.mun} `}
                  startDate={dateFormatter(farm.start_date)}
                  endDate={dateFormatter(farm.harvest_date)}
                  imageSource={imageUrls[farm.id]}
                  onPress={() => { handleCardPress(farm) }}
                />
              ))}
            </View>
          </ScrollView>
      }
    </>
  );
}

const styles = StyleSheet.create({
  container: {
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
    width: 350,
    height: 120,
    borderRadius: 5,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'green'
  },
  cardDescription: {
    fontSize: 16,
    lineHeight: 18,
    alignItems: 'flex-start'
  },

  cardDate: {
    mt: 3,
    fontSize: 10,
    lineHeight: 20,
    alignItems: 'flex-start',
    marginLeft:5
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
});

export default TabView;
