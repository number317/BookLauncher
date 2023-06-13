import React from 'react';
import { View, Text } from 'react-native';
import NavigationBar from '../../components/navigation-bar';
import Gray16 from '../../components/gray16';
import styles from './style';

const Setting = () => {
  return (
    <View style={styles.main}>
      <NavigationBar currentMenu="Setting" />
      <View style={styles.setting}>
        <Text>Setting</Text>
        <Gray16 />
      </View>
    </View>
  );
};

export default Setting;
