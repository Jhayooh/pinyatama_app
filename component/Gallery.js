import React, { useState } from 'react';
import { Button, ImageBackground, Keyboard, Platform, StyleSheet, TextInput, View } from 'react-native';
import { SceneMap, TabView } from 'react-native-tab-view';

function FarmGal() {
  return (
    <View>
      
    </View>
  )
}

function Lahat() {

}

function Buwan0() {

}

function Buwan6() {

}

function Buwan12(params) {

}

function Buwan18(params) {

}

function Aanihin() {

}

const renderScene = SceneMap({
  lahat: Lahat,
  buwan0: Buwan0,
  buwan6: Buwan6,
  buwan12: Buwan12,
  buwan18: Buwan18,
  aanihin: Aanihin,
});


const Gallery = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [index, setIndex] = React.useState(0);
  const [clicked,setCLicked]=useState(false);
  const [routes] = useState([
    { key: 'lahat', title: 'Lahat' },
    { key: 'buwan0', title: 'Buwan0' },
    { key: 'buwan6', title: 'Buwan6' },
    { key: 'buwan12', title: 'Buwan12' },
    { key: 'buwan18', title: 'Buwan18' },
    { key: 'aanihin', title: 'Aanihin' },
  ]);

  const updateSearch = (text) => {
    setSearch(text);
  };


  return (
    <View style={styles.container}>
      <ImageBackground
      
        source={require('../assets/brakrawnd.png')}
        style={styles.backgroundImage}
      >
        <SearchBar navigation={navigation} />
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
        />
      </ImageBackground>
    </View>
  );
};
const SearchBar = ({clicked, searchPhrase, setSearchPhrase, setCLicked, navigation}) => {
  return (
    <View style={styles.searchcontainer}>
      <View
        style={
          clicked
            ? styles.searchBar__clicked
            : styles.searchBar__unclicked
        }
      >
        {/* Input field */}
        <TextInput
          style={styles.input}
          placeholder="Search"
          value={searchPhrase}
          onChangeText={setSearchPhrase}
          onFocus={() => {
            setClicked(true);
          }}
        />
        {/* cross Icon, depending on whether the search bar is clicked or not */}
        {clicked && (
          <Entypo name="cross" size={20} color="black" style={{ padding: 1 }} onPress={() => {
              setSearchPhrase("")
          }}/>
        )}
      </View>
      {/* cancel button, depending on whether the search bar is clicked or not */}
      {clicked && (
        <View>
          <Button
            title="Cancel"
            onPress={() => {
              Keyboard.dismiss();
              setClicked(false);
            }}
          ></Button>
        </View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent', // Adjust the opacity here
    padding: 20,
  },

  searchBarInputContainer: {
    backgroundColor: 'white',
  },
  cardContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    borderRadius: 10,

  },
  cardText: {
    marginBottom: 10,
    color: 'black',
    fontFamily: Platform.OS === 'android' ? 'Roboto' : undefined,

  },
  cardButton: {
    borderRadius: 0,
    marginLeft: 50,
    marginRight: 0,
    marginBottom: 0,
    backgroundColor: 'white',
  },
  searchcontainer:{
    margin: 20,
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    width: "90%",
  },
    searchBar__unclicked: {
      padding: 10,
      flexDirection: "row",
      width: "95%",
      backgroundColor: "#d9dbda",
      borderRadius: 15,
      alignItems: "center",
    },
    searchBar__clicked: {
      padding: 10,
      flexDirection: "row",
      width: "80%",
      backgroundColor: "#d9dbda",
      borderRadius: 15,
      alignItems: "center",
      justifyContent: "space-evenly",
    },
    input: {
      fontSize: 20,
      marginLeft: 10,
      width: "90%",
    },

});

export default Gallery;
