import React from 'react';
import { View, Text } from 'react-native';
import styles from './style';

const Gray16 = () => (
  <View>
    <Text>16阶灰度</Text>
    <View>
      {
        new Array(16).fill(0).map((_, index) => (
          <View style={styles[index]} key={index} />
        ))
      }
    </View>
  </View>
);

export default Gray16;
