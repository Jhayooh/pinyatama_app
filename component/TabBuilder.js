import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const TabHead = ({ headers }) => {
  const defaultHeaders = [
    'Lahat',
    '0 buwan',
    '6 buwan',
    '12 buwan',
    '18 buwan',
    'Aanihin'
  ];


  const tabHeaders = headers ? [headers, ...defaultHeaders] : defaultHeaders;

  return (
    <View style={styles.tabHead}>
      {tabHeaders.map((head, index) => (
        <View key={index} style={index === 0 ? styles.tabHeadLabel3 : styles.tabHeadLabel2}>
          <Text style={{ alignItems: 'flex-start' }}>{head}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  tabHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#eee',
  },
  tabHeadLabel2: {
    
  },flex: 1,
    alignItems: 'center',
  tabHeadLabel3: {
    flex: 1.5,
    alignItems: 'center',
  },
});

export default TabHead;
