import React from 'react';
// import { TabView, SceneMap } from 'react-native-tab-view';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import TabView from './TabView';
import Video from './Video';
// function FarmGal({ navigation }) {
//   return (
//     <View style={{ flex: 1, height: 320 }}>
//       <Text>Pangalan ng pinya</Text>
//       {/* Using arrow function to call navigation.navigate properly */}
//       <Button onPress={() => navigation.navigate('ProductionInput')} title="Navigate to Production Input" />
//     </View>
//   );
// }

// function Lahat({ navigation }) {
//   return <FarmGal navigation={navigation} />;
// }

// function Buwan0({ navigation }) {
//   return <FarmGal navigation={navigation} />;
// }

// function Buwan6({ navigation }) {
//   return <FarmGal navigation={navigation} />;
// }

// function Buwan12({ navigation }) {
//   return <FarmGal navigation={navigation} />;
// }

// function Buwan18({ navigation }) {
//   return <FarmGal navigation={navigation} />;
// }

// function Aanihin({ navigation }) {
//   return <FarmGal navigation={navigation} />;
// }

// const renderScene = SceneMap({
//   lahat: Lahat,
//   buwan0: Buwan0,
//   buwan6: Buwan6,
//   buwan12: Buwan12,
//   buwan18: Buwan18,
//   aanihin: Aanihin,
// });


// const Gallery = ({ navigation }) => {
//   const [search, setSearch] = useState('');
//   const [index, setIndex] = useState(0);
//   const [routes] = useState([
//     { key: 'lahat', title: 'Lahat' },
//     { key: 'buwan0', title: 'Buwan0' },
//     { key: 'buwan6', title: 'Buwan6' },
//     { key: 'buwan12', title: 'Buwan12' },
//     { key: 'buwan18', title: 'Buwan18' },
//     { key: 'aanihin', title: 'Aanihin' },
//   ]);

//   const updateSearch = (text) => {
//     setSearch(text);
//   };


//   return (
//     <View style={styles.container}>
//       <ImageBackground
//         source={require('../assets/brakrawnd.png')}
//         style={styles.backgroundImage}
//       >
//         <TabView
//           navigationState={{ index, routes }}
//           renderScene={(props) => renderScene({ ...props, navigation })}
//           onIndexChange={setIndex}
//         />
//       </ImageBackground>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   backgroundImage: {
//     flex: 1,
//     resizeMode: 'cover',
//   },
//   overlay: {
//     flex: 1,
//     backgroundColor: 'transparent', 
//     padding: 20,
//   },

//   searchBarInputContainer: {
//     backgroundColor: 'white',
//   },
//   cardContainer: {
//     backgroundColor: 'rgba(0, 0, 0, 0)',
//     borderRadius: 10,

//   },
//   cardText: {
//     marginBottom: 10,
//     color: 'black',
//     fontFamily: Platform.OS === 'android' ? 'Roboto' : undefined,

//   },
//   cardButton: {
//     borderRadius: 0,
//     marginLeft: 50,
//     marginRight: 0,
//     marginBottom: 0,
//     backgroundColor: 'white',
//   },

// });

// export default Gallery;
const Tab = createMaterialTopTabNavigator();

export default function Gallery({navigation}) {
  return (
    <Tab.Navigator
      initialRouteName="Feed"
      screenProps={{navigation}}
      screenOptions={{
        tabBarActiveTintColor: '#e91e63',
        tabBarLabelStyle: { fontSize: 12 },
        tabBarStyle: { backgroundColor: 'powderblue' },
      }}
    >
      <Tab.Screen
        name="Notifications"
        component={TabView}
        options={{ tabBarLabel: 'Lahat' }}
      />
      <Tab.Screen
        name="Profile"
        component={Video}
        options={{ tabBarLabel: '0 buwan' }}
      />
      <Tab.Screen
        name="Notif"
        component={TabView}
        options={{ tabBarLabel: '6 buwan' }}
      />
      <Tab.Screen
        name="Prof"
        component={Video}
        options={{ tabBarLabel: '12 buwan' }}
      />
      <Tab.Screen
        name="Notification"
        component={TabView}
        options={{ tabBarLabel: '18 buwan' }}
      />
      <Tab.Screen
        name="Pro"
        component={Video}
        options={{ tabBarLabel: 'Aanihin' }}
      />
    </Tab.Navigator>
  );
}