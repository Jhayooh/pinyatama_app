import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity,ScrollView, View, Image } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Charts from './Charts'; 
import Profile from './Profile'; 
import Images from './ImagesTab'; 
import { TableBuilder } from './TableBuilder';

//db
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { collection, doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/Config';

const Tab = createMaterialTopTabNavigator();

const ProductionInput = ({ route, navigation }) => {
  const [user] = useAuthState(auth)
  const { farms = [] } = route.params
  const farm = farms[0]
  const [edit, setEdit] = useState(false)
  const [roiDetails, setRoiDetails] = useState({})

  const componentsColl = collection(db, `farms/${farm.id}/components`)
  const [compData, compLoading, compError] = useCollectionData(componentsColl)

  const addDocumentWithId = async () => {
    setIsShow(false)
    onChangeText('')
    try {
      const documentRef = doc(collParticular, text);
      await setDoc(documentRef, { name: text, totalInputs: 0 });
    } catch (error) {
      console.error('Error adding document:', error);
    }
  };

    

  return (
    <>
    <SafeAreaView style={styles.container}>
    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', gap: 3 , marginLeft:15}}>
      <Text style={styles.name}>{farm.title}</Text>
      <TouchableOpacity style={{ height: 32, alignItems: 'center', justifyContent: 'center' }} onPress={() => {
        setEdit(!edit)
      }}>            
       <Image source={require('../assets/edit.png')} style={{ width: 20, height: 20 }} />
      </TouchableOpacity>
    </View>
      <Text style={styles.location}>{`${farm.mun}, ${farm.brgy}`}</Text>

      {edit ? (
        <Tab.Navigator
          initialRouteName="Profile"
          tabBarOptions={{
            activeTintColor: 'green',
            labelStyle: { fontSize: 11, fontWeight: 'bold' },
            style: { backgroundColor: 'white' },
          }}
        >
          <Tab.Screen
            name="Profile"
            component={Profile} 
            options={{ tabBarLabel: 'Profile' }}
          />
          <Tab.Screen
            name="Images"
            component={Images} 
            options={{ tabBarLabel: 'Images' }}
          />
          <Tab.Screen
            name="CostAndReturn"
            options={{ tabBarLabel: 'Cost and Return' }}
          >
            {() => (
              <ScrollView>
                <TableBuilder components={compData} area={farm.area} setRoiDetails={setRoiDetails} />
              </ScrollView>
            )}
          </Tab.Screen>

        </Tab.Navigator>
      ) : (
        <Charts farms={farms} />
      )}
    </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'green',
  },
  location: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft:20
  },
  // editButton: {
  //   padding: 10,
  // },
  // editIcon: {
  //   width: 20,
  //   height: 20,
  // },
});

export default ProductionInput;


// import { collection, doc, setDoc } from 'firebase/firestore';
// import React, { useState } from 'react';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { useCollectionData } from 'react-firebase-hooks/firestore';
// import {
//   ActivityIndicator,
//   ImageBackground,
//   Modal,
//   SafeAreaView,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
//   Image
// } from "react-native";
// import { auth, db } from '../firebase/Config';
// import { BottomButton } from './BottomButton';
// import Charts from './Charts';
// import { TableBuilder } from './TableBuilder';

// const ProductionInput = ({ route, navigation }) => {
//   const [user] = useAuthState(auth)
//   const { farms = [] } = route.params
//   const farm = farms[0]
//   const [edit, setEdit] = useState(false)
//   const [roiDetails, setRoiDetails] = useState({})

//   const componentsColl = collection(db, `farms/${farm.id}/components`)
//   const [compData, compLoading, compError] = useCollectionData(componentsColl)

//   const addDocumentWithId = async () => {
//     setIsShow(false)
//     onChangeText('')
//     try {
//       const documentRef = doc(collParticular, text);
//       await setDoc(documentRef, { name: text, totalInputs: 0 });
//     } catch (error) {
//       console.error('Error adding document:', error);
//     }
//   };

//   return (
//     <>
//       <SafeAreaView style={styles.container}>
//         <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', gap: 3 , marginLeft:15}}>
//           <Text style={styles.name}>{farm.title}</Text>
//           <TouchableOpacity style={{ height: 32, alignItems: 'center', justifyContent: 'center', paddingTop: 20 }} onPress={() => {
//             setEdit(!edit)
//           }}>
//             <Image source={require('../assets/edit.png')} style={{ width: 20, height: 20 }} />
//           </TouchableOpacity>
//         </View>
//         <Text style={styles.loc}>{`${farm.mun}, ${farm.brgy}`}</Text>


//         {edit
//           ?
//           <>
//             < ScrollView style={styles.scrollView}>       
//               {
//                 compLoading
//                   ?
//                   <ActivityIndicator size='small' color='#3bcd6b' style={{ padding: 64, backgroundColor: '#fff' }} />
//                   :
//                   <TableBuilder
//                     components={compData}
//                     area={farm.area}
//                     setRoiDetails={setRoiDetails}
//                   />
//               }
//             </ScrollView>
//           </>
//           :
//           <Charts farms={farms} />
//         }
//       </SafeAreaView >


//     </>
//   )
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
    
//   },
//   image: {
//     flex: 1,
//     padding: 12,
//     backgroundColor: '#22b14c',
//     padding: 20

//   },
//   name: {
//     fontSize: 32,
//     paddingTop: 20,
//     color: 'green',
//     fontWeight: '700',
//     marginLeft: 5
//   },
//   loc: {
//     fontSize: 16,
//     color: 'black',
//     fontWeight: '700',
//     marginTop: 6,
//     marginLeft: 25
//   },
//   label: {
//     alignItems: 'center',
//     marginTop: 18,
//     fontSize: 12,
//     justifyContent: 'center',
//     fontWeight: 'bold',
//     fontFamily: 'serif',
//     color: '#4DAF50',
    

//   },
//   scrollView: {
//     marginTop: 12,
//     flex: 1,
//   },
//   texts: {
//     color: '#fff',
//     fontSize: 14,
//     fontWeight: '800',
//   },
//   tableHead: {
//     flexDirection: 'row',
//     borderBottomWidth: 1,
//     borderColor: '#ddd',
//     padding: 6,
//     backgroundColor: '#3bcd6b',
//     alignSelf: 'stretch',
//     marginBottom: '16'
//   },
//   tableHeadLabel2: {
//     flex: 2,
//     alignSelf: 'stretch'
//   },
//   tableHeadLabel3: {
//     flex: 3,
//     alignSelf: 'stretch'
//   },
//   tableData: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderBottomWidth: 1,
//     borderColor: '#ddd',
//     padding: 6,
//     backgroundColor: '#fff',
//     flex: 1,
//     alignSelf: 'stretch',
//     flexDirection: 'row'
//   },

//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   modalContent: {
//     backgroundColor: 'white',
//     width: 280,
//     padding: 20,
//     borderRadius: 10,
//     elevation: 5, 
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   modalLabel: {
//     fontSize: 12,
//     fontWeight: 'bold',
//     marginBottom: 9,
//   },
//   input: {
//     height: 40,
//     borderColor: 'gray',
//     borderWidth: 1,
//     marginBottom: 10,
//     paddingHorizontal: 10,
//   },
// })

// export default ProductionInput