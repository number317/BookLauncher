import React from 'react';
import { View } from 'react-native';
import styles from './style';

const Gray16 = () => (
  <View style={styles.container}>
    {
      new Array(16).fill(0).map((_, index) => (
        <View style={styles[index]} key={index} />
      ))
    }
  </View>
);

export default Gray16;
