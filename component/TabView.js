import React from 'react';
import { Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Card = ({ imageSource, title, description, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <Image source={imageSource} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDescription}>{description}</Text>
      </View>
    </TouchableOpacity>
  );
};

const TabView = ({ navigation }) => {
  const handleCardPress = () => {
    console.log('Card pressed!');
  };

  return (
    <ImageBackground source={require('../assets/p1.jpg')} resizeMode="cover" style={styles.backgroundImage}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <Card
             title="Card Title"
             description="This is the example of React Native Card view. This is the easiest way to adding a card view on your screen."
             imageSource={require('../assets/pine.jpg')}
             onPress={handleCardPress}
          />
          <Card
            title="Card Title"
            description="This is the example of React Native Card view. This is the easiest way to adding a card view on your screen."
            imageSource={require('../assets/pine.jpg')}
            onPress={handleCardPress}
          />
          <Card
            title="Card Title"
            description="This is the example of React Native Card view. This is the easiest way to adding a card view on your screen."
            imageSource={require('../assets/pine.jpg')}
            onPress={handleCardPress}
          />
          <Card
            title="Card Title"
            description="This is the example of React Native Card view. This is the easiest way to adding a card view on your screen."
            imageSource={require('../assets/pine.jpg')}
            onPress={handleCardPress}
          />
        </View>
      </ScrollView>
    </ImageBackground>
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
    marginBottom:20,
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
    alignItems: 'center',
    borderColor: 'green',
  },
  cardImage: {
    width: 350,
    height: 120,
    borderRadius:5,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cardDescription: {
    fontSize: 16,
    lineHeight: 24,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
});

export default TabView;
