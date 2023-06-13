import React from 'react';
import { View, Text } from 'react-native';
import NavitaionBar from '../../components/navigation-bar';
import styles from './style';

const BookHome = () => {
  return (
    <View style={styles.main}>
      <NavitaionBar currentMenu="Book" />
      <View style={styles.book}>
        <Text>book home</Text>
      </View>
    </View>
  );
};

export default BookHome;
