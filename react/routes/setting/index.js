import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { View, Text } from 'react-native';
import NavigationBar from '../../components/navigation-bar';
import Gray16 from '../../components/gray16';
import Store from '../../store';
import styles from './style';

const Setting = () => {
  const { rootStore } = useContext(Store);
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

export default observer(Setting);
